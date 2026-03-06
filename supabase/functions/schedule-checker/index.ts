import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Find posts that are scheduled and past due
    const now = new Date().toISOString();
    const { data: posts, error } = await supabaseAdmin
      .from("scheduled_posts")
      .select("*, instagram_accounts(*)")
      .eq("status", "scheduled")
      .lte("scheduled_at", now);

    if (error) throw error;
    if (!posts?.length) {
      return new Response(JSON.stringify({ message: "No posts to publish", count: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: any[] = [];

    for (const post of posts) {
      try {
        const account = post.instagram_accounts;
        if (!account) {
          await supabaseAdmin
            .from("scheduled_posts")
            .update({ status: "failed", updated_at: new Date().toISOString() })
            .eq("id", post.id);
          results.push({ id: post.id, status: "failed", reason: "No account linked" });
          continue;
        }

        // Check token expiry
        if (new Date(account.token_expires_at) < new Date()) {
          await supabaseAdmin
            .from("scheduled_posts")
            .update({ status: "failed", updated_at: new Date().toISOString() })
            .eq("id", post.id);
          results.push({ id: post.id, status: "failed", reason: "Token expired" });
          continue;
        }

        const igUserId = account.instagram_user_id;
        const accessToken = account.access_token;
        const caption = `${post.caption || ""}${post.hashtags?.length ? "\n\n" + post.hashtags.map((h: string) => `#${h}`).join(" ") : ""}`;

        let igPostId: string;

        if (post.post_type === "carousel" && post.image_urls.length > 1) {
          const containerIds: string[] = [];
          for (const imageUrl of post.image_urls) {
            const res = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ image_url: imageUrl, is_carousel_item: true, access_token: accessToken }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            containerIds.push(data.id);
          }

          const carouselRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ media_type: "CAROUSEL", children: containerIds.join(","), caption, access_token: accessToken }),
          });
          const carouselData = await carouselRes.json();
          if (carouselData.error) throw new Error(carouselData.error.message);

          const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ creation_id: carouselData.id, access_token: accessToken }),
          });
          const publishData = await publishRes.json();
          if (publishData.error) throw new Error(publishData.error.message);
          igPostId = publishData.id;
        } else {
          const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image_url: post.image_urls[0], caption, access_token: accessToken }),
          });
          const containerData = await containerRes.json();
          if (containerData.error) throw new Error(containerData.error.message);

          const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ creation_id: containerData.id, access_token: accessToken }),
          });
          const publishData = await publishRes.json();
          if (publishData.error) throw new Error(publishData.error.message);
          igPostId = publishData.id;
        }

        await supabaseAdmin
          .from("scheduled_posts")
          .update({ status: "published", instagram_post_id: igPostId, updated_at: new Date().toISOString() })
          .eq("id", post.id);

        results.push({ id: post.id, status: "published", igPostId });
      } catch (postErr) {
        await supabaseAdmin
          .from("scheduled_posts")
          .update({ status: "failed", updated_at: new Date().toISOString() })
          .eq("id", post.id);
        results.push({ id: post.id, status: "failed", reason: postErr.message });
      }
    }

    return new Response(JSON.stringify({ message: "Schedule check complete", results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
