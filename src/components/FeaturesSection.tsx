const features = [
  { icon: "🤖", title: "Génération de captions par IA", desc: "L'IA analyse votre image, comprend le contexte et rédige une description engageante adaptée à votre ton.", active: true },
  { icon: "#️⃣", title: "Hashtags intelligents & ciblés", desc: "Génération de 5 à 30 hashtags pertinents selon votre niche, votre localisation et l'algorithme Instagram." },
  { icon: "🎨", title: "Filtres & retouches automatiques", desc: "Appliquez des presets de filtres, ajustez luminosité/contraste/saturation, et créez votre propre preset." },
  { icon: "🖼️", title: "Posts simples & carrousels", desc: "Créez des posts à image unique ou des carrousels de 2 à 10 images avec descriptions individuelles ou globales." },
  { icon: "⏱️", title: "Programmation optimisée", desc: "SpeedPost analyse vos données d'engagement passées pour recommander les meilleurs créneaux." },
];

const FeaturesSection = () => (
  <section className="relative z-[1] px-6 lg:px-16 pb-24">
    <div className="text-xs uppercase tracking-[0.12em] text-coral font-semibold mb-3">▸ Fonctionnalités</div>
    <h2 className="font-display font-extrabold text-[clamp(2rem,4vw,3.5rem)] tracking-tight leading-[1.1]">
      Tout ce dont vous avez<br />besoin, en un seul endroit.
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 items-start">
      {/* Feature list */}
      <div className="flex flex-col gap-3">
        {features.map((f) => (
          <div key={f.title} className={`flex gap-4 p-5 bg-glass border rounded-2xl transition-all hover:border-coral/30 hover:bg-coral/5 hover:translate-x-1.5 items-start ${f.active ? 'border-coral/50 bg-coral/[0.08]' : 'border-border'}`}>
            <div className="w-[42px] h-[42px] rounded-xl shrink-0 flex items-center justify-center text-lg bg-gradient-to-br from-coral/15 to-orange/10 border border-coral/20">{f.icon}</div>
            <div>
              <h4 className="font-display font-semibold text-[0.95rem] mb-1">{f.title}</h4>
              <p className="text-muted-foreground text-[0.82rem] leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="bg-dark-3 rounded-3xl border border-border p-6 flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-warm" />
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-coral" style={{ animation: 'pulse 2s infinite' }} />
          Aperçu en direct — Génération IA
        </div>
        <div className="bg-dark-2 rounded-xl border border-border p-4">
          <div className="text-[0.7rem] text-coral uppercase tracking-wider font-semibold mb-2">✨ Description générée</div>
          <div className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">La nouvelle saison est arrivée. 🌸</strong><br />
            Des pièces intemporelles pensées pour vous accompagner au quotidien. Découvrez la collection Printemps 2025.
            <div className="text-violet-light mt-1">#mode #collection #printemps2025 #lifestyle #ootd #fashion #tendance</div>
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">📅 Créneaux suggérés</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { day: "Lun", time: "08h30" },
              { day: "Mar ★", time: "18h00", active: true },
              { day: "Mer", time: "12h00" },
              { day: "Ven", time: "19h30" },
            ].map((c) => (
              <div key={c.day} className={`bg-dark-2 rounded-lg border p-3 text-center ${c.active ? 'border-coral/50 bg-coral/[0.08]' : 'border-border'}`}>
                <div className="text-[0.7rem] text-muted-foreground">{c.day}</div>
                <div className={`font-display text-sm font-bold mt-0.5 ${c.active ? 'text-coral' : ''}`}>{c.time}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-dark-2 rounded-lg p-4 border border-border">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Engagement prédit</span>
            <strong className="text-foreground">72% / élevé</strong>
          </div>
          <div className="h-1.5 bg-[hsl(0_0%_100%/0.08)] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-primary w-[72%]" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
