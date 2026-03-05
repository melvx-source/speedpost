import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname + location.hash;
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Accueil", href: "/" },
    { label: "Comment ça fonctionne", href: "/comment-ca-fonctionne" },
    { label: "Tarifs", href: "/#tarifs" },
    { label: "Contactez-nous", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/" && !location.hash;
    if (href.startsWith("/#")) return currentPath === href;
    return location.pathname === href;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-16 py-4 bg-background/70 backdrop-blur-xl border-b border-border" style={{ animation: 'slideDown 0.8s cubic-bezier(0.16,1,0.3,1) both' }}>
        <a href="/" className="font-display font-extrabold text-2xl text-gradient-warm">SpeedPost</a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {links.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={`text-sm transition-colors relative group ${isActive(item.href) ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
                {item.label}
                <span className={`absolute left-0 -bottom-1 h-px bg-coral transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </a>
            </li>
          ))}
          <li>
            <a href="/login" className="bg-gradient-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-medium shadow-glow hover:-translate-y-0.5 transition-transform">
              Connexion →
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground p-1" aria-label="Menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-[49] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 md:hidden" style={{ animation: 'fadeUp 0.3s ease-out both' }}>
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`text-xl font-display font-semibold transition-colors ${isActive(item.href) ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {item.label}
            </a>
          ))}
          <a href="/login" onClick={() => setOpen(false)} className="bg-gradient-primary text-primary-foreground px-8 py-3 rounded-full font-medium shadow-glow mt-4">
            Connexion →
          </a>
        </div>
      )}
    </>
  );
};

export default Navbar;
