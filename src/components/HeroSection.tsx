const HeroSection = () => (
  <section className="relative z-[1] min-h-screen flex flex-col justify-center px-6 lg:px-16 pt-32 pb-16 overflow-hidden">
    {/* Eyebrow */}
    <div className="inline-flex items-center gap-2 bg-glass border border-border rounded-full px-4 py-1.5 text-xs font-medium text-yellow tracking-widest uppercase w-fit mb-6" style={{ animation: 'fadeUp 0.8s 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-yellow" style={{ animation: 'pulse 2s infinite' }} />
      Powered by IA · Instagram Scheduling
    </div>

    {/* Title */}
    <h1 className="font-display font-extrabold text-[clamp(3rem,7vw,6.5rem)] leading-[1] tracking-tighter max-w-[900px]" style={{ animation: 'fadeUp 0.8s 0.5s cubic-bezier(0.16,1,0.3,1) both' }}>
      <span className="text-gradient-warm block">Programmez vos posts</span>
      <span className="text-outline block">Instagram</span>
      en quelques clics.
    </h1>

    <p className="text-muted-foreground text-lg max-w-[520px] mt-6 font-light leading-relaxed" style={{ animation: 'fadeUp 0.8s 0.7s cubic-bezier(0.16,1,0.3,1) both' }}>
      Importez vos photos, laissez l'IA rédiger vos descriptions, hashtags et appliquer vos filtres — puis planifiez la publication automatique.
    </p>

    {/* Actions */}
    <div className="flex items-center gap-4 mt-8" style={{ animation: 'fadeUp 0.8s 0.9s cubic-bezier(0.16,1,0.3,1) both' }}>
      <a href="#" className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-7 py-3.5 rounded-xl font-medium shadow-glow hover:-translate-y-1 hover:shadow-[0_16px_48px_hsl(349_100%_65%/0.5)] transition-all">
        🚀 Commencer gratuitement
      </a>
      <a href="#" className="inline-flex items-center gap-2 bg-glass border border-border text-foreground px-7 py-3.5 rounded-xl backdrop-blur-lg hover:bg-[hsl(0_0%_100%/0.1)] hover:-translate-y-0.5 transition-all">
        ▶ Voir la démo
      </a>
    </div>

    {/* Stats */}
    <div className="flex items-center gap-8 mt-12" style={{ animation: 'fadeUp 0.8s 1.1s cubic-bezier(0.16,1,0.3,1) both' }}>
      {[
        { number: "+2 400", label: "Posts programmés" },
        { number: "98%", label: "Taux de satisfaction" },
        { number: "3x", label: "Plus rapide qu'avant" },
      ].map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-8">
          {i > 0 && <div className="w-px h-10 bg-border" />}
          <div className="flex flex-col">
            <span className="font-display font-bold text-3xl text-gradient-primary">{stat.number}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Phone mockup - desktop only */}
    <div className="hidden xl:block absolute right-16 top-1/2" style={{ animation: 'fadeUp 0.8s 0.6s cubic-bezier(0.16,1,0.3,1) both, float 6s ease-in-out infinite' }}>
      <PhoneMockup />
    </div>
  </section>
);

const PhoneMockup = () => (
  <div className="w-[280px] h-[560px] bg-dark-3 rounded-[40px] border-2 border-[hsl(0_0%_100%/0.12)] shadow-[0_40px_100px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col">
    <div className="w-[100px] h-7 bg-background rounded-b-[18px] mx-auto shrink-0" />
    <div className="flex-1 bg-gradient-to-b from-dark-3 to-dark-2 p-3 flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between px-0 py-1">
        <span className="font-display text-sm font-bold">Instagram</span>
      </div>
      <div className="flex gap-2 overflow-hidden">
        {["👩", "🧑", "👨‍💼", "👩‍🎨"].map((emoji, i) => (
          <div key={i} className="w-[50px] h-[50px] rounded-full shrink-0 relative">
            <div className="absolute inset-[-2px] rounded-full bg-gradient-warm -z-10" />
            <div className="w-full h-full rounded-full bg-dark-3 border-2 border-dark-2 flex items-center justify-center text-lg">{emoji}</div>
          </div>
        ))}
      </div>
      <div className="bg-dark-3 rounded-xl overflow-hidden" style={{ animation: 'postAppear 1.5s 1.5s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div className="flex items-center gap-2 px-3 py-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-coral to-violet shrink-0" />
          <div>
            <div className="text-[10px] font-semibold">@votremarque</div>
            <div className="text-[8px] text-muted-foreground">Programmé — Demain 18h00</div>
          </div>
        </div>
        <div className="w-full h-[150px] bg-gradient-to-br from-[#FF4D6D22] via-[#7B2FBE33] to-[#FF8C4222] flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-coral/30 to-violet/30 flex items-center justify-center">
            <span className="bg-gradient-to-br from-coral to-violet text-primary-foreground text-[7px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">✨ Généré par IA</span>
          </div>
          <span className="absolute top-2 right-2 bg-yellow/90 text-[#1A1A00] text-[7px] font-bold px-2 py-0.5 rounded-full">📅 Planifié</span>
        </div>
        <div className="px-3 py-2 text-[9px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Découvrez notre nouvelle collection 🌟</strong><br />
          La qualité au service de votre style.
          <div className="text-violet-light">#mode #lifestyle #nouveauté</div>
        </div>
      </div>
    </div>
  </div>
);

export default HeroSection;
