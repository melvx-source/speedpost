const items = [
  "Génération IA de captions", "Hashtags intelligents", "Filtres personnalisés",
  "Posts simples & carrousels", "Programmation automatique", "API Instagram officielle",
  "Calendrier éditorial", "Statistiques avancées",
];

const FeaturesBand = () => (
  <div className="relative z-[1] px-6 lg:px-16 py-6 border-t border-b border-border bg-glass backdrop-blur-lg flex items-center gap-8 overflow-hidden">
    <span className="text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground whitespace-nowrap shrink-0">Fonctionnalités</span>
    <div className="flex gap-8 items-center" style={{ animation: 'scrollLeft 20s linear infinite' }}>
      {[...items, ...items].map((item, i) => (
        <div key={i} className="flex items-center gap-2 whitespace-nowrap text-sm text-muted-foreground">
          <span className="text-coral">✦</span> {item}
        </div>
      ))}
    </div>
  </div>
);

export default FeaturesBand;
