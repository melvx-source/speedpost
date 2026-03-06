
-- Storage bucket for post images
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);

-- Instagram accounts table
CREATE TABLE public.instagram_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  instagram_user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  access_token TEXT NOT NULL,
  token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  profile_picture_url TEXT,
  followers_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, instagram_user_id)
);

-- Scheduled posts table
CREATE TABLE public.scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  instagram_account_id UUID REFERENCES public.instagram_accounts(id) ON DELETE CASCADE NOT NULL,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  caption TEXT,
  hashtags TEXT[] DEFAULT '{}',
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  post_type TEXT NOT NULL DEFAULT 'single',
  instagram_post_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Post analytics table
CREATE TABLE public.post_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_post_id UUID REFERENCES public.scheduled_posts(id) ON DELETE CASCADE NOT NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.instagram_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_analytics ENABLE ROW LEVEL SECURITY;

-- RLS: instagram_accounts
CREATE POLICY "Users can manage own instagram accounts" ON public.instagram_accounts
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS: scheduled_posts
CREATE POLICY "Users can manage own scheduled posts" ON public.scheduled_posts
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS: post_analytics (users can read analytics for their own posts)
CREATE POLICY "Users can read own post analytics" ON public.post_analytics
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.scheduled_posts sp WHERE sp.id = scheduled_post_id AND sp.user_id = auth.uid()
  ));

-- Service role needs to insert analytics (from edge functions)
CREATE POLICY "Service role can manage analytics" ON public.post_analytics
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Service role needs to update scheduled_posts status (from edge functions)
CREATE POLICY "Service role can manage scheduled posts" ON public.scheduled_posts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Service role can read instagram accounts for publishing
CREATE POLICY "Service role can read instagram accounts" ON public.instagram_accounts
  FOR SELECT TO service_role USING (true);

-- Storage RLS for post-images bucket
CREATE POLICY "Users can upload post images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'post-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can read own post images" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'post-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Public can read post images" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'post-images');

CREATE POLICY "Users can delete own post images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'post-images' AND (storage.foldername(name))[1] = auth.uid()::text);
