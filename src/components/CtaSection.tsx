const CtaSection = () => (
  <section className="relative z-[1] px-6 lg:px-16 py-24 text-center">
    <div className="max-w-[700px] mx-auto bg-gradient-to-br from-violet/15 to-coral/10 border border-coral/20 rounded-[32px] px-8 lg:px-16 py-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[linear-gradient(90deg,transparent,hsl(var(--coral)),hsl(var(--orange)),transparent)]" />
      <div className="inline-flex items-center gap-2 bg-glass border border-border rounded-full px-4 py-1.5 text-xs font-medium text-yellow tracking-widest uppercase mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow" style={{ animation: 'pulse 2s infinite' }} />
        Aucune carte bancaire requise
      </div>
      <h2 className="font-display font-extrabold text-[clamp(2rem,4vw,3rem)] tracking-tight mb-4">Prêt à automatiser votre Instagram ?</h2>
      <p className="text-muted-foreground leading-relaxed mb-8">Rejoignez +500 créateurs et agences qui publient plus vite, mieux, sans effort.</p>
      <div className="flex justify-center gap-4 flex-wrap">
        <a href="#" className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-7 py-3.5 rounded-xl font-medium shadow-glow hover:-translate-y-1 hover:shadow-[0_16px_48px_hsl(349_100%_65%/0.5)] transition-all">
          🚀 Démarrer — c'est gratuit
        </a>
        <a href="#" className="inline-flex items-center gap-2 bg-glass border border-border text-foreground px-7 py-3.5 rounded-xl backdrop-blur-lg hover:bg-[hsl(0_0%_100%/0.1)] hover:-translate-y-0.5 transition-all">
          Voir les tarifs
        </a>
      </div>
    </div>
  </section>
);

export default CtaSection;
