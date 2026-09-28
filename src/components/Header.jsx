import React from 'react';
import { ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export default function Header() {
  return (
    <header className="header-container">
      <div className="header-badge">
        <BookOpen size={14} className="badge-icon" />
        <span>Manual Contraseñas S3guR4$_ &middot; Hacker Mentor</span>
      </div>

      <h1 className="header-title">
        Validador & Generador de <span className="header-accent">Contraseñas</span>
      </h1>

      <p className="header-description">
        Crea contraseñas memorables y seguras a partir de palabras cotidianas y comprueba su
        robustez contra ataques de fuerza bruta en tiempo real.
      </p>

      <nav className="header-nav">
        <a href="#generador" className="nav-chip">
          <Sparkles size={14} />
          <span>Generador</span>
        </a>
        <a href="#validador" className="nav-chip">
          <ShieldCheck size={14} />
          <span>Validador</span>
        </a>
      </nav>
    </header>
  );
}
