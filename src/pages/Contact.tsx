import { useState } from "react";
import { Mail, Building2, User, MessageSquare, Send, Clock, Instagram, Linkedin, Twitter, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const subjects = [
  "Support technique",
  "Question sur un abonnement",
  "Demande plan Agency / Commercial",
  "Bug à signaler",
  "Partenariat",
  "Autre",
];

const quickFaq = [
  { q: "Puis-je changer de plan à tout moment ?", a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment depuis vos paramètres. Le changement est appliqué immédiatement." },
  { q: "Comment fonctionne le support prioritaire ?", a: "Les utilisateurs Pro et Agency bénéficient d'un support prioritaire avec un temps de réponse garanti de moins de 4h en jours ouvrés." },
  { q: "Proposez-vous des formations ou un onboarding ?", a: "Oui, le plan Agency inclut un onboarding personnalisé. Pour les autres plans, des tutoriels vidéo et une documentation complète sont disponibles." },
];

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden transition-colors hover:border-primary/30">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-3.5 text-left">
        <span className="text-foreground font-medium text-sm pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 pb-4" : "max-h-0"}`}>
        <p className="px-5 text-muted-foreground text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

const isBusinessHours = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  if (day === 0) return false;
  if (day === 6) return hour >= 10 && hour < 14;
  return hour >= 9 && hour < 18;
};

const Contact = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [acceptData, setAcceptData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const online = isBusinessHours();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptData) {
      toast.error("Veuillez accepter la politique de données.");
      return;
    }
    setLoading(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
    toast.success("Message envoyé !");
  };

  return (
    <>
      <div className="bg-mesh" />
      <div className="fixed bottom-[100px] left-[100px] w-[400px] h-[400px] rounded-full bg-violet/15 blur-[80px] pointer-events-none z-0" style={{ animation: "blobDrift 15s ease-in-out infinite alternate" }} />

      <Navbar />

      {/* HERO */}
      <section className="relative z-[1] pt-32 pb-12 px-6 lg:px-16 text-center">
        <div className="max-w-2xl mx-auto" style={{ animation: "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both" }}>
          <div className="inline-flex items-center gap-2 bg-glass border border-border rounded-full px-4 py-1.5 text-xs font-medium text-yellow tracking-widest uppercase mb-6">
            💬 On vous répond en moins de 24h
          </div>
          <h1 className="font-display font-extrabold text-[clamp(2rem,5vw,3.5rem)] tracking-tight leading-[1.1] mb-4">
            Parlons de votre <span className="text-gradient-warm">projet.</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Une question, un bug, une demande commerciale ? L'équipe SpeedPost est là.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="relative z-[1] px-6 lg:px-16 pb-24">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* FORM — 60% */}
          <div className="flex-[3]" style={{ animation: "fadeUp 0.8s 0.1s cubic-bezier(0.16,1,0.3,1) both" }}>
            {sent ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-bold text-2xl text-foreground mb-2">✅ Message envoyé !</h3>
                <p className="text-muted-foreground">Nous répondrons sous 24h. Merci pour votre confiance.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Entreprise (optionnel)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
                </div>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select value={subject} onChange={(e) => setSubject(e.target.value)} required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm appearance-none cursor-pointer">
                    <option value="" disabled>Objet du message</option>
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, 2000))} placeholder="Votre message..." required rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-none" />
                  <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">{message.length}/2000</span>
                </div>
                <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={acceptData} onChange={(e) => setAcceptData(e.target.checked)} className="mt-0.5 rounded border-border" />
                  J'accepte que mes données soient utilisées pour répondre à ma demande.
                </label>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow hover:-translate-y-0.5 transition-transform disabled:opacity-50">
                  {loading ? "Envoi en cours..." : "Envoyer le message →"}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT COL — 40% */}
          <div className="flex-[2] space-y-8" style={{ animation: "fadeUp 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) both" }}>
            {/* Contact info */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <h3 className="font-display font-bold text-lg text-foreground">Autres moyens de nous contacter</h3>
              <a href="mailto:contact@speedpost.fr" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                contact@speedpost.fr
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-9 h-9 rounded-lg bg-violet/15 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-violet-light" />
                </div>
                <button className="hover:text-foreground transition-colors">Ouvrir le chat en direct</button>
              </div>
              <div className="flex items-center gap-3">
                {[
                  { icon: Instagram, href: "#", color: "text-primary" },
                  { icon: Linkedin, href: "#", color: "text-primary" },
                  { icon: Twitter, href: "#", color: "text-primary" },
                ].map(({ icon: Icon, href, color }) => (
                  <a key={Icon.displayName} href={href} target="_blank" rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-lg bg-secondary flex items-center justify-center ${color} hover:bg-primary/15 transition-colors`}>
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-display font-bold text-lg text-foreground">Horaires de support</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Lundi – Vendredi</span><span className="text-foreground">9h – 18h</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Samedi</span><span className="text-foreground">10h – 14h</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Dimanche</span><span className="text-foreground">Fermé</span></div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${online ? "bg-green-500" : "bg-destructive"}`} style={online ? { animation: "pulse 2s infinite" } : {}} />
                <span className={online ? "text-green-400" : "text-destructive"}>{online ? "En ligne maintenant" : "Hors ligne"}</span>
              </div>
            </div>

            {/* Quick FAQ */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-lg text-foreground">FAQ rapide</h3>
              {quickFaq.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
              <a href="/comment-ca-fonctionne#faq" className="text-primary text-sm hover:underline font-medium block mt-2">
                Voir toutes les FAQ →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contact;
