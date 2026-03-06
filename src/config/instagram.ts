// Meta (Facebook/Instagram) API Configuration
// Replace with your Meta App ID from https://developers.facebook.com/apps/
export const META_APP_ID = "";

// OAuth redirect URI (auto-generated)
export const INSTAGRAM_REDIRECT_URI = typeof window !== "undefined"
  ? `${window.location.origin}/auth/instagram/callback`
  : "";

// OAuth scopes
export const INSTAGRAM_SCOPES = "instagram_basic,instagram_content_publish,instagram_manage_insights";

// Build the OAuth URL
export const getInstagramOAuthUrl = () =>
  `https://www.facebook.com/v19.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(INSTAGRAM_REDIRECT_URI)}&scope=${INSTAGRAM_SCOPES}&response_type=code`;
