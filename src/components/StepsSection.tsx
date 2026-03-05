const steps = [
  { icon: "📸", title: "Importez vos photos", desc: "Glissez-déposez vos images en masse. Organisez-les en posts simples ou en carrousels. Appliquez vos filtres favoris en un clic depuis notre bibliothèque ou importez les vôtres.", iconClass: "bg-gradient-to-br from-coral/20 to-orange/20 border border-coral/30" },
  { icon: "🤖", title: "L'IA rédige pour vous", desc: "Notre IA analyse vos images et génère automatiquement une description personnalisée, les hashtags les plus pertinents et adapte le ton selon votre identité de marque.", iconClass: "bg-gradient-to-br from-violet/20 to-violet-light/20 border border-violet/30" },
  { icon: "📅", title: "Programmez & publiez", desc: "Choisissez votre créneau ou laissez SpeedPost analyser vos données d'engagement pour publier automatiquement au meilleur moment via l'API officielle Instagram.", iconClass: "bg-gradient-to-br from-yellow/20 to-orange/20 border border-yellow/30" },
];

const StepsSection = () => (
  <section className="relative z-[1] px-6 lg:px-16 py-24">
    <div className="text-xs uppercase tracking-[0.12em] text-coral font-semibold mb-3">▸ Comment ça marche</div>
    <h2 className="font-display font-extrabold text-[clamp(2rem,4vw,3.5rem)] tracking-tight leading-[1.1] mb-3">
      3 étapes.<br />Votre feed est en pilote automatique.
    </h2>
    <p className="text-muted-foreground max-w-[500px] font-light leading-relaxed">Plus besoin de passer des heures sur Instagram. SpeedPost automatise tout le processus de A à Z.</p>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-px mt-12 bg-border rounded-3xl overflow-hidden">
      {steps.map((step, i) => (
        <div key={i} className="bg-dark-2 p-8 relative overflow-hidden group hover:bg-dark-3 transition-colors">
          <div className="absolute top-4 right-6 font-display font-extrabold text-6xl text-[hsl(0_0%_100%/0.05)] leading-none">0{i + 1}</div>
          <div className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center text-2xl mb-5 ${step.iconClass}`}>{step.icon}</div>
          <h3 className="font-display font-bold text-lg mb-2">{step.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
          <div className="absolute inset-0 bg-gradient-to-br from-coral/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  </section>
);

export default StepsSection;
