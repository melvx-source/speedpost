const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16 py-4 bg-background/70 backdrop-blur-xl border-b border-border" style={{ animation: 'slideDown 0.8s cubic-bezier(0.16,1,0.3,1) both' }}>
    <div className="font-display font-extrabold text-2xl text-gradient-warm">SpeedPost</div>
    <ul className="hidden md:flex items-center gap-8 list-none">
      {["Accueil", "Comment ça fonctionne", "Tarifs", "Contact"].map((item) => (
        <li key={item}>
          <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors relative group">
            {item}
            <span className="absolute left-0 -bottom-1 w-0 h-px bg-coral transition-all duration-300 group-hover:w-full" />
          </a>
        </li>
      ))}
      <li>
        <a href="/login" className="bg-gradient-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-medium shadow-glow hover:-translate-y-0.5 transition-transform">
          Connexion →
        </a>
      </li>
    </ul>
  </nav>
);

export default Navbar;
