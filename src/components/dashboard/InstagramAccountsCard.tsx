import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Instagram, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const META_APP_ID = import.meta.env.VITE_META_APP_ID || "";
const REDIRECT_URI = typeof window !== "undefined" ? `${window.location.origin}/auth/instagram/callback` : "";
const OAUTH_URL = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=instagram_basic,instagram_content_publish,instagram_manage_insights&response_type=code`;

interface InstagramAccount {
  id: string;
  instagram_user_id: string;
  username: string;
  access_token: string;
  token_expires_at: string;
  profile_picture_url: string | null;
  followers_count: number;
}

const InstagramAccountsCard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("instagram_accounts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setAccounts(data as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  const handleDisconnect = async (accountId: string) => {
    const { error } = await supabase
      .from("instagram_accounts")
      .delete()
      .eq("id", accountId);

    if (error) {
      toast.error("Erreur lors de la déconnexion");
    } else {
      toast.success("Compte déconnecté");
      setAccounts((prev) => prev.filter((a) => a.id !== accountId));
    }
  };

  const isTokenExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Instagram className="w-5 h-5 text-primary" />
        <h2 className="font-display font-bold text-foreground">Comptes Instagram connectés</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((acc) => {
            const expired = isTokenExpired(acc.token_expires_at);
            return (
              <div key={acc.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  {acc.profile_picture_url ? (
                    <AvatarImage src={acc.profile_picture_url} alt={acc.username} />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold">
                    {acc.username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium">@{acc.username}</p>
                  <p className="text-muted-foreground text-xs">
                    {acc.followers_count.toLocaleString()} abonnés
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {expired ? (
                    <span className="flex items-center gap-1 text-xs text-yellow-400">
                      <AlertTriangle className="w-3.5 h-3.5" /> Token expiré
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <span className="w-2 h-2 rounded-full bg-green-500" /> Connecté
                    </span>
                  )}
                  <button
                    onClick={() => handleDisconnect(acc.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Déconnecter"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <a
            href={OAUTH_URL}
            className="w-full py-2.5 rounded-xl border border-dashed border-border text-muted-foreground text-sm hover:text-foreground hover:border-primary/30 transition-all flex items-center justify-center gap-2"
          >
            <Instagram className="w-4 h-4" />
            Connecter un compte Instagram
          </a>

          {expired_accounts_note(accounts)}
        </div>
      )}
    </div>
  );
};

function expired_accounts_note(accounts: InstagramAccount[]) {
  const expired = accounts.filter((a) => new Date(a.token_expires_at) < new Date());
  if (expired.length === 0) return null;
  return (
    <p className="text-xs text-yellow-400/80 mt-2">
      ⚠️ {expired.length} compte(s) avec token expiré. Reconnectez-les pour continuer à publier.
    </p>
  );
}

export default InstagramAccountsCard;
