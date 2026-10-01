import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowDownCircle, RefreshCw, KeyRound } from 'lucide-react';
import { generatePasswordSuggestions } from '../utils/passwordGenerator';

export default function PasswordGenerator({ onSelectForValidation }) {
  const [word, setWord] = useState('perro');
  const [suggestions, setSuggestions] = useState(() => generatePasswordSuggestions('perro'));
  const [copiedId, setCopiedId] = useState(null);

  const handleGenerate = (targetWord = word) => {
    const term = targetWord.trim() || 'perro';
    const results = generatePasswordSuggestions(term);
    setSuggestions(results);
  };

  const handleCopy = async (id, pwd) => {
    try {
      await navigator.clipboard.writeText(pwd);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <section id="generador" className="section-card">
      <div className="section-header">
        <div className="section-title-wrap">
          <h2 className="section-title">
            <KeyRound className="section-title-icon" />
            Generador de Contraseñas a partir de una Palabra
          </h2>
        </div>

      </div>

      <div className="generator-controls">
        <div className="input-group">
          <label htmlFor="base-word-input" className="input-label">
            Palabra o concepto base:
          </label>
          <div className="input-row">
            <input
              id="base-word-input"
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Ej. galleta, mentor, dragon, luna..."
              className="text-input"
              maxLength={30}
            />
            <button
              type="button"
              onClick={() => handleGenerate()}
              className="primary-btn"
              title="Generar 3 contraseñas seguras"
            >
              <Sparkles size={18} />
              <span>Generar 3 Opciones</span>
            </button>
          </div>
        </div>
      </div>

      <div className="suggestions-grid">
        {suggestions.map((item, index) => (
          <div key={`${item.id}-${index}`} className="suggestion-card">
            <div className="suggestion-card-header">
              <span className="suggestion-badge">{item.badge}</span>
              <span className="suggestion-length-tag">{item.password.length} caracteres</span>
            </div>

            <h3 className="suggestion-name">{item.name}</h3>

            <div className="password-display-box">
              <code className="password-text">{item.password}</code>
            </div>

            <p className="suggestion-desc">{item.description}</p>

            <div className="suggestion-actions">
              <button
                type="button"
                className={`action-btn copy-btn ${copiedId === item.id ? 'copied' : ''}`}
                onClick={() => handleCopy(item.id, item.password)}
                title="Copiar contraseña al portapapeles"
              >
                {copiedId === item.id ? (
                  <>
                    <Check size={16} />
                    <span>¡Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copiar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="action-btn test-btn"
                onClick={() => onSelectForValidation(item.password)}
                title="Probar esta contraseña en el validador"
              >
                <ArrowDownCircle size={16} />
                <span>Probar en Validador</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="generator-footer-action">
        <button
          type="button"
          className="regenerate-all-btn"
          onClick={() => handleGenerate()}
        >
          <RefreshCw size={16} />
          <span>Generar nuevas variantes con "{word || 'palabra'}"</span>
        </button>
      </div>
    </section>
  );
}
