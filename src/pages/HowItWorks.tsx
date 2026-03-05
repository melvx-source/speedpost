import { Camera, Bot, Palette, CalendarClock, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

/* ─── STEP MOCKUPS ─── */
const ImportMockup = () => (
  <div className="bg-card border border-border rounded-2xl p-6 space-y-4" style={{ animation: "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both" }}>
    <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center">
      <Camera className="w-10 h-10 text-primary mx-auto mb-3" />
      <p className="text-foreground font-medium text-sm">Glissez vos photos ici</p>
      <p className="text-muted-foreground text-xs mt-1">JPG, PNG, WEBP · Jusqu'à 50 images</p>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {[1,2,3,4,5,6,7,8].map((i) => (
        <div key={i} className="aspect-square rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-xs"
          style={{ animation: `fadeUp 0.5s ${i * 0.08}s cubic-bezier(0.16,1,0.3,1) both` }}>
          📸
        </div>
      ))}
    </div>
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>8 images importées</span>
      <span className="text-primary font-medium">50 max acceptées</span>
    </div>
  </div>
);

const AiMockup = () => (
  <div className="bg-card border border-border rounded-2xl p-6 space-y-4" style={{ animation: "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both" }}>
    <div className="flex gap-2 flex-wrap">
      {["Professionnel", "Casual", "Inspirant", "Humoristique", "Luxe"].map((tone) => (
        <span key={tone} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${tone === "Inspirant" ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}>
          {tone}
        </span>
      ))}
    </div>
    <div className="bg-secondary rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs text-primary font-medium">Généré par IA</span>
      </div>
      <p className="text-foreground text-sm leading-relaxed">
        Laissez la lumière dorée guider votre journée ✨ Chaque instant est une opportunité de créer quelque chose de beau...
      </p>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {["#lifestyle", "#inspiration", "#photography", "#golden", "#mood", "#aesthetic"].map((tag) => (
        <span key={tag} className="px-2 py-1 rounded-md bg-violet/15 text-violet-light text-xs">{tag}</span>
      ))}
    </div>
  </div>
);

const FilterMockup = () => (
  <div className="bg-card border border-border rounded-2xl p-6 space-y-4" style={{ animation: "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both" }}>
    <div className="flex gap-2 overflow-hidden">
      {["Vintage", "Clair", "Drama", "Pastel", "B&W", "Sunset"].map((f) => (
        <div key={f} className={`flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center text-xs font-medium ${f === "Clair" ? "bg-primary/20 border-2 border-primary text-foreground" : "bg-secondary text-muted-foreground"}`}>
          {f}
        </div>
      ))}
    </div>
    <div className="space-y-3">
      {[{ label: "Luminosité", value: 65 }, { label: "Contraste", value: 45 }, { label: "Saturation", value: 70 }].map((s) => (
        <div key={s.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{s.label}</span>
            <span className="text-foreground">{s.value}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: `${s.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CalendarMockup = () => (
  <div className="bg-card border border-border rounded-2xl p-6 space-y-4" style={{ animation: "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both" }}>
    <div className="grid grid-cols-7 gap-1 text-center text-xs">
      {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
        <span key={i} className="text-muted-foreground py-1">{d}</span>
      ))}
      {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
        const hasPost = [3, 7, 11, 15, 18, 22, 25].includes(day);
        const isToday = day === 15;
        return (
          <div key={day} className={`aspect-square rounded-lg flex items-center justify-center text-xs relative ${isToday ? "bg-primary text-primary-foreground font-bold" : hasPost ? "text-foreground" : "text-muted-foreground"}`}>
            {day}
            {hasPost && !isToday && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-coral" />}
          </div>
        );
      })}
    </div>
    <div className="space-y-2">
      {[
        { time: "Mar 18h00", label: "⭐ Meilleur engagement" },
        { time: "Jeu 12h00", label: "Bon créneau" },
        { time: "Sam 10h30", label: "Recommandé" },
      ].map((slot) => (
        <div key={slot.time} className="flex items-center justify-between bg-secondary rounded-lg px-3 py-2 text-xs">
          <span className="text-foreground font-medium">{slot.time}</span>
          <span className="text-primary">{slot.label}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─── FAQ ─── */
const faqItems = [
  { q: "Est-ce que SpeedPost utilise l'API officielle d'Instagram ?", a: "Oui, SpeedPost se connecte exclusivement via l'API officielle Meta Business. Vos données et votre compte sont entièrement sécurisés grâce au protocole OAuth." },
  { q: "Mon compte Instagram risque-t-il d'être banni ?", a: "Non. Contrairement aux outils non officiels, SpeedPost utilise l'API Meta certifiée. Aucun risque de ban ou de restriction sur votre compte." },
  { q: "Puis-je modifier la description générée par l'IA ?", a: "Absolument ! La description générée est toujours modifiable. Vous gardez le contrôle total sur le contenu publié." },
  { q: "Combien de temps faut-il pour programmer un post ?", a: "Moins de 2 minutes. Importez votre photo, laissez l'IA générer la description et les hashtags, choisissez un créneau — c'est tout." },
  { q: "Est-ce que ça fonctionne pour les comptes professionnels et créateurs ?", a: "Oui, SpeedPost est compatible avec les comptes professionnels (Business) et créateurs (Creator) sur Instagram." },
  { q: "Puis-je annuler une publication programmée ?", a: "Oui, vous pouvez annuler ou modifier une publication programmée jusqu'à 10 minutes avant l'heure prévue." },
  { q: "Quelles langues sont supportées pour la génération IA ?", a: "L'IA prend en charge le français, l'anglais, l'espagnol, l'italien et l'allemand." },
  { q: "Est-ce que mes photos sont stockées sur vos serveurs ?", a: "Vos photos sont stockées de manière sécurisée et chiffrée. Consultez notre politique de confidentialité pour plus de détails sur la gestion de vos données." },
];

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden transition-colors hover:border-primary/30">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left">
        <span className="text-foreground font-medium text-sm pr-4">{q}</span>
        <span className={`text-muted-foreground transition-transform duration-300 flex-shrink-0 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 pb-4" : "max-h-0"}`}>
        <p className="px-6 text-muted-foreground text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

/* ─── STEPS DATA ─── */
const steps = [
  {
    num: "01",
    icon: Camera,
    title: "Importez vos photos & organisez vos contenus",
    description: [
      "Glissez-déposez vos images en masse (JPEG, PNG, WEBP, jusqu'à 50 images à la fois) directement dans l'interface.",
      "Organisez vos contenus en dossiers et projets pour une gestion optimale.",
      "Créez des posts simples (1 image) ou des carrousels (2 à 10 images, ordre réorganisable par drag & drop).",
      "Recadrage automatique au format Instagram (1:1, 4:5, 16:9).",
    ],
    mockup: <ImportMockup />,
  },
  {
    num: "02",
    icon: Bot,
    title: "L'IA rédige, vous validez",
    description: [
      "Analyse visuelle de l'image par l'IA : reconnaissance d'objets, ambiance, couleurs dominantes.",
      "Génération d'une description personnalisée en français ou dans la langue de votre choix.",
      "Choix du ton : Professionnel, Casual, Inspirant, Humoristique ou Luxe.",
      "Génération de 10 à 30 hashtags classés par pertinence (populaires + niche).",
      "Possibilité de regénérer ou éditer manuellement la description, et d'ajouter un call-to-action.",
    ],
    mockup: <AiMockup />,
    reverse: true,
  },
  {
    num: "03",
    icon: Palette,
    title: "Sublimez vos images avec vos filtres",
    description: [
      "Bibliothèque de 20+ filtres prédéfinis : Vintage, Clair, Dramatique, Pastel, Noir & Blanc, etc.",
      "Curseurs d'ajustement : Luminosité, Contraste, Saturation, Netteté, Température.",
      "Créez et sauvegardez vos propres presets « Brandbook » pour une cohérence visuelle.",
      "Application en masse : appliquez le même filtre à toutes les photos sélectionnées.",
      "Aperçu avant/après en temps réel.",
    ],
    mockup: <FilterMockup />,
  },
  {
    num: "04",
    icon: CalendarClock,
    title: "Choisissez quand publier — ou laissez l'IA décider",
    description: [
      "Sélection manuelle de la date et de l'heure via un calendrier intuitif.",
      "Mode automatique : SpeedPost analyse vos statistiques et propose les 3 meilleurs créneaux de la semaine.",
      "File d'attente intelligente : vos posts sont publiés automatiquement dans l'ordre.",
      "Connexion sécurisée via l'API officielle Meta/Instagram (OAuth).",
      "Notification email/push après chaque publication réussie.",
    ],
    mockup: <CalendarMockup />,
    reverse: true,
  },
];

/* ─── PAGE ─── */
const HowItWorks = () => (
  <>
    <div className="bg-mesh" />
    <div className="fixed top-[-100px] right-[200px] w-[500px] h-[500px] rounded-full bg-violet/15 blur-[80px] pointer-events-none z-0" style={{ animation: "blobDrift 15s ease-in-out infinite alternate" }} />

    <Navbar />

    {/* HERO */}
    <section className="relative z-[1] pt-32 pb-16 px-6 lg:px-16 text-center">
      <div className="max-w-3xl mx-auto" style={{ animation: "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both" }}>
        <div className="inline-flex items-center gap-2 bg-glass border border-border rounded-full px-4 py-1.5 text-xs font-medium text-yellow tracking-widest uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Fonctionnement détaillé
        </div>
        <h1 className="font-display font-extrabold text-[clamp(2rem,5vw,3.5rem)] tracking-tight leading-[1.1] mb-4">
          De l'import à la publication,{" "}
          <span className="text-gradient-warm">tout est automatique.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
          Découvrez comment SpeedPost transforme vos photos en posts Instagram engageants, programmés et publiés sans effort.
        </p>
        <a href="/login" className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-7 py-3.5 rounded-xl font-medium shadow-glow hover:-translate-y-1 transition-all">
          Essayer gratuitement <ArrowRight className="w-4 h-4" />
        </a>

        {/* Step icons row */}
        <div className="flex items-center justify-center gap-4 mt-12">
          {[
            { icon: "📸", label: "Import" },
            { icon: "🤖", label: "IA" },
            { icon: "🎨", label: "Filtres" },
            { icon: "📅", label: "Planification" },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-2xl bg-glass border border-border flex items-center justify-center text-2xl">
                  {step.icon}
                </div>
                <span className="text-xs text-muted-foreground">{step.label}</span>
              </div>
              {i < 3 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <div className="w-8 h-px bg-border" />
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* STEPS */}
    {steps.map((step, idx) => (
      <section key={step.num} className="relative z-[1] px-6 lg:px-16 py-16 lg:py-24">
        <div className={`max-w-6xl mx-auto flex flex-col ${step.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-20 items-center`}
          style={{ animation: `fadeUp 0.8s ${idx * 0.1}s cubic-bezier(0.16,1,0.3,1) both` }}>
          {/* Text */}
          <div className="flex-1 space-y-5">
            <span className="font-display text-[5rem] font-extrabold text-outline leading-none select-none">{step.num}</span>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-foreground">{step.title}</h2>
            </div>
            <ul className="space-y-3">
              {step.description.map((line, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          {/* Mockup */}
          <div className="flex-1 w-full max-w-md">
            {step.mockup}
          </div>
        </div>
      </section>
    ))}

    {/* FAQ */}
    <section className="relative z-[1] px-6 lg:px-16 py-16 lg:py-24">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-center mb-4">Questions fréquentes</h2>
        <p className="text-muted-foreground text-center mb-10">Tout ce que vous devez savoir sur SpeedPost.</p>
        <div className="space-y-3">
          {faqItems.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="/contact" className="text-primary text-sm hover:underline font-medium">
            Consulter toutes les FAQ →
          </a>
        </div>
      </div>
    </section>

    <CtaSection />
    <Footer />
  </>
);

export default HowItWorks;
