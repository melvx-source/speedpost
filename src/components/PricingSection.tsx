const plans = [
  {
    name: "Starter", desc: "Parfait pour les indépendants et petits créateurs qui débutent leur automatisation Instagram.",
    price: "19€", features: [
      { text: "1 compte Instagram", ok: true }, { text: "30 posts / mois", ok: true },
      { text: "Génération IA de captions", ok: true }, { text: "Hashtags automatiques", ok: true },
      { text: "5 filtres de base", ok: true }, { text: "Carrousels", ok: false }, { text: "Statistiques avancées", ok: false },
    ],
  },
  {
    name: "Pro", desc: "Pour les agences et freelances qui gèrent activement leur présence ou celle de leurs clients.",
    price: "49€", featured: true, badge: "⚡ Populaire", features: [
      { text: "3 comptes Instagram", ok: true }, { text: "150 posts / mois", ok: true },
      { text: "Génération IA avancée", ok: true }, { text: "Hashtags + ciblage niche", ok: true },
      { text: "Filtres illimités + presets", ok: true }, { text: "Carrousels (10 images)", ok: true }, { text: "Statistiques avancées", ok: true },
    ],
  },
  {
    name: "Agency", desc: "Pour les agences SaaS gérant de multiples clients avec des besoins avancés de personnalisation.",
    price: "129€", features: [
      { text: "Comptes illimités", ok: true }, { text: "Posts illimités", ok: true },
      { text: "IA ultra-personnalisée", ok: true }, { text: "Hashtags IA temps réel", ok: true },
      { text: "Carrousels illimités", ok: true }, { text: "Dashboard admin central", ok: true }, { text: "White-label inclus", ok: true },
    ],
  },
];

const PricingSection = () => (
  <section className="relative z-[1] px-6 lg:px-16 pb-24">
    <div className="text-xs uppercase tracking-[0.12em] text-coral font-semibold mb-3">▸ Tarifs</div>
    <h2 className="font-display font-extrabold text-[clamp(2rem,4vw,3.5rem)] tracking-tight leading-[1.1] mb-3">Simple, transparent,<br />sans surprise.</h2>
    <p className="text-muted-foreground max-w-[500px] font-light">Choisissez le plan qui correspond à votre volume. Sans engagement, résiliable à tout moment.</p>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-12">
      {plans.map((plan) => (
        <div key={plan.name} className={`bg-dark-2 rounded-3xl border p-7 relative overflow-hidden transition-transform hover:-translate-y-2 ${plan.featured ? 'border-coral/40 bg-gradient-to-b from-coral/[0.08] to-dark-2' : 'border-border'}`}>
          {plan.featured && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-primary" />}
          {plan.badge && <span className="inline-block bg-gradient-primary text-primary-foreground text-[0.65rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">{plan.badge}</span>}
          <div className="font-display font-bold text-xl mb-2">{plan.name}</div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">{plan.desc}</p>
          <div className="font-display font-extrabold text-4xl tracking-tight mb-1">{plan.price}<span className="text-base text-muted-foreground font-normal">/mois</span></div>
          <div className="h-px bg-border my-5" />
          <ul className="flex flex-col gap-3">
            {plan.features.map((f) => (
              <li key={f.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className={f.ok ? 'text-coral' : 'text-[hsl(0_0%_100%/0.2)]'}>{f.ok ? '✓' : '✗'}</span> {f.text}
              </li>
            ))}
          </ul>
          <a href="#" className={`block text-center mt-7 py-3 rounded-xl font-medium text-sm transition-all hover:-translate-y-0.5 ${plan.featured ? 'bg-gradient-primary text-primary-foreground shadow-glow shadow-glow-hover' : 'border border-border text-foreground hover:border-[hsl(0_0%_100%/0.3)]'}`}>
            {plan.name === "Agency" ? "Contacter l'équipe →" : "Commencer →"}
          </a>
        </div>
      ))}
    </div>
  </section>
);

export default PricingSection;
