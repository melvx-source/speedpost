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

    const { post_id } = await req.json();
    if (!post_id) {
      return new Response(JSON.stringify({ error: "Missing post_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Fetch the post
    const { data: post, error: postError } = await supabaseAdmin
      .from("scheduled_posts")
      .select("*, instagram_accounts(*)")
      .eq("id", post_id)
      .single();

    if (postError || !post) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const account = post.instagram_accounts;
    const igUserId = account.instagram_user_id;
    const accessToken = account.access_token;
    const caption = `${post.caption || ""}${post.hashtags?.length ? "\n\n" + post.hashtags.map((h: string) => `#${h}`).join(" ") : ""}`;

    let igPostId: string;

    if (post.post_type === "carousel" && post.image_urls.length > 1) {
      // Carousel: create individual media containers
      const containerIds: string[] = [];
      for (const imageUrl of post.image_urls) {
        const res = await fetch(
          `https://graph.facebook.com/v19.0/${igUserId}/media`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_url: imageUrl,
              is_carousel_item: true,
              access_token: accessToken,
            }),
          }
        );
        const data = await res.json();
        if (data.error) throw new Error(`Carousel item failed: ${data.error.message}`);
        containerIds.push(data.id);
      }

      // Create carousel container
      const carouselRes = await fetch(
        `https://graph.facebook.com/v19.0/${igUserId}/media`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            media_type: "CAROUSEL",
            children: containerIds.join(","),
            caption,
            access_token: accessToken,
          }),
        }
      );
      const carouselData = await carouselRes.json();
      if (carouselData.error) throw new Error(`Carousel creation failed: ${carouselData.error.message}`);

      // Publish carousel
      const publishRes = await fetch(
        `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creation_id: carouselData.id,
            access_token: accessToken,
          }),
        }
      );
      const publishData = await publishRes.json();
      if (publishData.error) throw new Error(`Publish failed: ${publishData.error.message}`);
      igPostId = publishData.id;
    } else {
      // Single image post
      const containerRes = await fetch(
        `https://graph.facebook.com/v19.0/${igUserId}/media`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url: post.image_urls[0],
            caption,
            access_token: accessToken,
          }),
        }
      );
      const containerData = await containerRes.json();
      if (containerData.error) throw new Error(`Container creation failed: ${containerData.error.message}`);

      // Publish
      const publishRes = await fetch(
        `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creation_id: containerData.id,
            access_token: accessToken,
          }),
        }
      );
      const publishData = await publishRes.json();
      if (publishData.error) throw new Error(`Publish failed: ${publishData.error.message}`);
      igPostId = publishData.id;
    }

    // Update post status
    await supabaseAdmin
      .from("scheduled_posts")
      .update({
        status: "published",
        instagram_post_id: igPostId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", post_id);

    return new Response(JSON.stringify({ success: true, instagram_post_id: igPostId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
