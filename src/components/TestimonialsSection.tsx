const testimonials = [
  {
    stars: 5, text: "SpeedPost a transformé ma gestion Instagram. Je passe désormais 20 min par semaine au lieu de 3h. Les captions générées par l'IA sont bluffantes de pertinence.",
    name: "Sophie M.", role: "Créatrice de contenu · @sophiestyle", emoji: "👩‍💼", gradient: "from-coral to-orange",
  },
  {
    stars: 5, text: "En tant qu'agence gérant 15 clients, SpeedPost est indispensable. Le plan Agency nous permet d'automatiser tout en maintenant une vraie personnalisation par marque.",
    name: "Romain K.", role: "Directeur · Agence DigiBoost", emoji: "🧑‍💻", gradient: "from-violet to-violet-light",
  },
  {
    stars: 4, text: "Les carrousels générés automatiquement sont d'une qualité incroyable. Mon taux d'engagement a augmenté de 40% depuis que j'utilise SpeedPost.",
    name: "Lucas P.", role: "Photographe freelance · @lucasphoto", emoji: "👨‍🎨", gradient: "from-yellow to-orange",
  },
];

const TestimonialsSection = () => (
  <section className="relative z-[1] px-6 lg:px-16 pb-24">
    <div className="text-xs uppercase tracking-[0.12em] text-coral font-semibold mb-3">▸ Ils nous font confiance</div>
    <h2 className="font-display font-extrabold text-[clamp(2rem,4vw,3.5rem)] tracking-tight leading-[1.1]">Des résultats concrets,<br />des clients convaincus.</h2>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-12">
      {testimonials.map((t) => (
        <div key={t.name} className="bg-dark-2 rounded-2xl border border-border p-7 transition-transform hover:-translate-y-1">
          <div className="text-yellow text-sm mb-4">{"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}</div>
          <p className="text-sm leading-relaxed text-muted-foreground italic mb-5">"{t.text}"</p>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-base shrink-0`}>{t.emoji}</div>
            <div>
              <div className="font-display font-semibold text-sm">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default TestimonialsSection;
