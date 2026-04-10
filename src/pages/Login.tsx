import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Mail, Lock, User, Building2, X } from "lucide-react";
import { getInstagramOAuthUrl } from "@/config/instagram";
import { toast } from "sonner";

const Login = () => {
  const [tab, setTab] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen flex">
      {/* LEFT COLUMN */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-10"
        style={{ background: "linear-gradient(135deg, hsl(240 33% 5%), hsl(271 61% 15%), hsl(349 100% 20%))" }}>
        <div className="bg-mesh absolute inset-0 opacity-60" />
        <div className="relative z-10">
          <a href="/" className="font-display font-extrabold text-2xl text-gradient-warm">SpeedPost</a>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="font-display font-extrabold text-4xl text-foreground">
            {tab === "login" ? "Bon retour 👋" : "Rejoignez SpeedPost"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Gérez votre Instagram en pilote automatique grâce à l'IA.
          </p>
          {/* Mini testimonials */}
          <div className="space-y-4 mt-8">
            {[
              { name: "Marie L.", text: "SpeedPost m'a fait gagner 10h par semaine !", stars: 5 },
              { name: "Thomas K.", text: "L'IA génère des descriptions parfaites.", stars: 5 },
              { name: "Julie R.", text: "Indispensable pour mon agence.", stars: 5 },
            ].map((t) => (
              <div key={t.name} className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-yellow text-sm">★</span>
                  ))}
                </div>
                <p className="text-foreground text-sm italic">"{t.text}"</p>
                <p className="text-muted-foreground text-xs mt-1">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <a href="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors">← Retour à l'accueil</a>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-16 bg-card relative">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <a href="/" className="font-display font-extrabold text-2xl text-gradient-warm">SpeedPost</a>
        </div>

        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex rounded-xl bg-secondary p-1 mb-8">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Créer un compte
            </button>
          </div>

          {tab === "login" ? <LoginForm onSwitch={() => setTab("signup")} /> : <SignupForm onSwitch={() => setTab("login")} />}
        </div>
      </div>
    </div>
  );
};

/* ─── LOGIN FORM ─── */
const LoginForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Connexion réussie !");
      navigate("/dashboard");
    }
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            className="w-full pl-10 pr-12 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          />
          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
            <input type="checkbox" className="rounded border-border" />
            Se souvenir de moi
          </label>
          <button type="button" onClick={() => setShowReset(true)} className="text-primary hover:underline">
            Mot de passe oublié ?
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow hover:-translate-y-0.5 transition-transform disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter →"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-muted-foreground text-xs">ou</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <a href={getInstagramOAuthUrl()} className="w-full py-3 rounded-xl border border-border bg-secondary text-foreground font-medium text-sm hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"/></svg>
        Continuer avec Instagram
      </a>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Pas encore de compte ?{" "}
        <button onClick={onSwitch} className="text-primary hover:underline font-medium">Créer un compte →</button>
      </p>

      {showReset && <ResetPasswordModal onClose={() => setShowReset(false)} />}
    </>
  );
};

/* ─── SIGNUP FORM ─── */
const SignupForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [accountType, setAccountType] = useState("independant");
  const [acceptCgu, setAcceptCgu] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["", "bg-destructive", "bg-yellow", "bg-green-500"];
  const strengthLabels = ["", "Faible", "Moyen", "Fort"];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPwd) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!acceptCgu) {
      toast.error("Vous devez accepter les CGU.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { first_name: firstName, last_name: lastName, account_type: accountType },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Compte créé ! Vérifiez votre email pour confirmer.");
    }
  };

  return (
    <>
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prénom" required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
          </div>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nom" required
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
        </div>
        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {password.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full rounded-full transition-all ${strengthColors[passwordStrength]}`} style={{ width: `${(passwordStrength / 3) * 100}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">{strengthLabels[passwordStrength]}</span>
            </div>
          )}
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="Confirmer le mot de passe" required
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
        </div>

        {/* Account type */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Type de compte</p>
          <div className="flex gap-2">
            {[
              { value: "independant", label: "Indépendant" },
              { value: "agence", label: "Agence" },
              { value: "entreprise", label: "Entreprise" },
            ].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setAccountType(t.value)}
                className={`flex-1 py-2 rounded-lg text-sm border transition-all ${
                  accountType === t.value
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={acceptCgu} onChange={(e) => setAcceptCgu(e.target.checked)} className="mt-0.5 rounded border-border" />
          <span>
            J'accepte les{" "}
            <button type="button" className="text-primary hover:underline">CGU</button> et la{" "}
            <button type="button" className="text-primary hover:underline">Politique de confidentialité</button>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow hover:-translate-y-0.5 transition-transform disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer mon compte →"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-muted-foreground text-xs">ou</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <a href={getInstagramOAuthUrl()} className="w-full py-3 rounded-xl border border-border bg-secondary text-foreground font-medium text-sm hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"/></svg>
        S'inscrire avec Instagram
      </a>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Déjà un compte ?{" "}
        <button onClick={onSwitch} className="text-primary hover:underline font-medium">Se connecter →</button>
      </p>
    </>
  );
};

/* ─── RESET PASSWORD MODAL ─── */
const ResetPasswordModal = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-sm shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
        <h3 className="font-display font-bold text-xl text-foreground mb-2">Réinitialiser votre mot de passe</h3>
        {sent ? (
          <div className="space-y-3">
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <p className="text-foreground font-medium">Email envoyé !</p>
              <p className="text-muted-foreground text-sm mt-1">Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4 mt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              required
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow hover:-translate-y-0.5 transition-transform disabled:opacity-50"
            >
              {loading ? "Envoi..." : "Envoyer le lien de réinitialisation"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
