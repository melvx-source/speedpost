const Footer = () => (
  <footer className="relative z-[1] px-6 lg:px-16 py-8 border-t border-border flex flex-col lg:flex-row items-center justify-between gap-4">
    <div className="font-display font-extrabold text-xl text-gradient-primary">SpeedPost</div>
    <ul className="flex flex-wrap justify-center gap-6 list-none">
      {["Accueil", "Comment ça fonctionne", "Tarifs", "Contactez-nous", "Mentions légales", "CGU"].map((link) => (
        <li key={link}><a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">{link}</a></li>
      ))}
    </ul>
    <p className="text-xs text-muted-foreground">© 2025 SpeedPost · Tous droits réservés</p>
  </footer>
);

export default Footer;
