import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const metaAppSecret = Deno.env.get("META_APP_SECRET")!;

    // Verify user
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseUser.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const { code, redirect_uri, app_id } = await req.json();
    if (!code || !redirect_uri || !app_id) {
      return new Response(JSON.stringify({ error: "Missing code, redirect_uri or app_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 1: Exchange code for short-lived token
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${app_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&client_secret=${metaAppSecret}&code=${code}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      return new Response(JSON.stringify({ error: "OAuth token exchange failed", details: tokenData.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 2: Exchange for long-lived token (60 days)
    const longLivedUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${app_id}&client_secret=${metaAppSecret}&fb_exchange_token=${tokenData.access_token}`;
    const longLivedRes = await fetch(longLivedUrl);
    const longLivedData = await longLivedRes.json();
    if (longLivedData.error) {
      return new Response(JSON.stringify({ error: "Long-lived token exchange failed", details: longLivedData.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessToken = longLivedData.access_token;
    const expiresIn = longLivedData.expires_in || 5184000; // 60 days default
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // Step 3: Get Facebook pages
    const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
    const pagesData = await pagesRes.json();
    if (!pagesData.data?.length) {
      return new Response(JSON.stringify({ error: "No Facebook pages found. Instagram Business accounts require a linked Facebook page." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 4: Get Instagram Business Account for each page
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    const connectedAccounts: any[] = [];

    for (const page of pagesData.data) {
      const igRes = await fetch(
        `https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
      );
      const igData = await igRes.json();

      if (igData.instagram_business_account) {
        const igUserId = igData.instagram_business_account.id;

        // Get Instagram profile info
        const profileRes = await fetch(
          `https://graph.facebook.com/v19.0/${igUserId}?fields=username,profile_picture_url,followers_count&access_token=${page.access_token}`
        );
        const profileData = await profileRes.json();

        // Upsert into database
        const { data, error } = await supabaseAdmin
          .from("instagram_accounts")
          .upsert(
            {
              user_id: userId,
              instagram_user_id: igUserId,
              username: profileData.username || page.name,
              access_token: page.access_token, // Use page token for publishing
              token_expires_at: tokenExpiresAt,
              profile_picture_url: profileData.profile_picture_url || null,
              followers_count: profileData.followers_count || 0,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,instagram_user_id" }
          )
          .select()
          .single();

        if (!error && data) {
          connectedAccounts.push(data);
        }
      }
    }

    if (connectedAccounts.length === 0) {
      return new Response(JSON.stringify({ error: "No Instagram Business accounts found on your pages." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, accounts: connectedAccounts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
