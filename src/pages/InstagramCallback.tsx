import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const META_APP_ID = import.meta.env.VITE_META_APP_ID || "";

const InstagramCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connexion de votre compte Instagram...");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setMessage("Autorisation refusée. Veuillez réessayer.");
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("Code d'autorisation manquant.");
      return;
    }

    if (!session) {
      setStatus("error");
      setMessage("Vous devez être connecté pour lier un compte Instagram.");
      return;
    }

    const exchangeCode = async () => {
      try {
        const redirectUri = `${window.location.origin}/auth/instagram/callback`;
        const { data, error } = await supabase.functions.invoke("instagram-auth", {
          body: { code, redirect_uri: redirectUri, app_id: META_APP_ID },
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        setStatus("success");
        setMessage(`${data.accounts.length} compte(s) Instagram connecté(s) avec succès !`);
        setTimeout(() => navigate("/dashboard"), 2000);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Erreur lors de la connexion.");
      }
    };

    exchangeCode();
  }, [searchParams, session, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center space-y-4">
        {status === "loading" && <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />}
        {status === "success" && <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />}
        {status === "error" && <XCircle className="w-12 h-12 text-destructive mx-auto" />}
        <p className="text-foreground font-medium">{message}</p>
        {status === "error" && (
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            Retour au Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default InstagramCallback;
