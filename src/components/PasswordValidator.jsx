import React, { useState, useEffect, useRef } from 'react';
import {
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Terminal,
  Laptop,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { validatePassword } from '../utils/passwordValidator';

const MANUAL_SAMPLES = [
  {
    name: 'Frase Secreta (Pág. 6)',
    password: 'MisPerros3ComenGalletas!',
    desc: 'Ejemplo textual del manual: frase única con números y símbolos.',
  },
  {
    name: 'Contraseña Segura (Pág. 11)',
    password: 'T!g3rL!ly#2024!RunS',
    desc: 'Ejemplo del manual: leet, mayúsculas, números y símbolos.',
  },
  {
    name: 'Patrón Obvio Inseguro',
    password: 'password123',
    desc: 'Palabra común y secuencia que el manual advierte NO usar.',
  },
];

export default function PasswordValidator({ currentPassword, onPasswordChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const prevScoreRef = useRef(0);
  const inputRef = useRef(null);

  const evaluation = validatePassword(currentPassword);

  // Efecto de celebración con confeti en la paleta solicitada
  useEffect(() => {
    if (evaluation.score === 100 && prevScoreRef.current < 100) {
      try {
        confetti({
          particleCount: 75,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#DF52F0', '#1E8ADE', '#A130EF', '#273AEA', '#511EEE'],
        });
      } catch (e) {
        console.error('Confetti error:', e);
      }
    }
    prevScoreRef.current = evaluation.score;
  }, [evaluation.score]);

  const handleClear = () => {
    onPasswordChange('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleLoadSample = (samplePassword) => {
    onPasswordChange(samplePassword);
    if (inputRef.current) inputRef.current.focus();
  };

  // Gradiente dinámico utilizando estrictamente la paleta solicitada
  const getProgressGradient = (score) => {
    if (score >= 90) return 'linear-gradient(90deg, #273AEA 0%, #1E8ADE 100%)';
    if (score >= 75) return 'linear-gradient(90deg, #511EEE 0%, #273AEA 100%)';
    if (score >= 50) return 'linear-gradient(90deg, #A130EF 0%, #511EEE 100%)';
    if (score >= 25) return 'linear-gradient(90deg, #DF52F0 0%, #A130EF 100%)';
    return 'linear-gradient(90deg, #DF52F0 0%, #DF52F0 100%)';
  };

  return (
    <section id="validador" className="validator-section-wrapper">
      {/* Encabezado exterior minimalista */}
      <div className="section-header text-center">
        <div className="section-title-wrap justify-center">
          <div className="section-number-pill section-number-azure">Sección 02</div>
          <h2 className="section-title">
            <Laptop className="section-title-icon azure-icon" size={22} />
            Estación de Trabajo: Validador de Contraseñas
          </h2>
        </div>
        <p className="section-subtitle">
          Interactúa directamente con la computadora de seguridad para inspeccionar tu contraseña
          en tiempo real contra los parámetros del manual.
        </p>
      </div>

      {/* DISPOSITIVO: COMPUTADORA WORKSTATION */}
      <div className="computer-workstation">
        {/* Monitor */}
        <div className="computer-monitor">
          {/* Bisel del Monitor */}
          <div className="monitor-bezel">
            {/* Cámara web superior */}
            <div className="webcam-module">
              <span className="webcam-lens" />
              <span className="webcam-status-led" />
            </div>

            {/* Pantalla de la Computadora */}
            <div className="computer-screen">
              {/* Barra superior del sistema operativo */}
              <div className="screen-titlebar">
                <div className="traffic-lights">
                  <span className="traffic-dot dot-magenta" title="Cerrar" />
                  <span className="traffic-dot dot-purple" title="Minimizar" />
                  <span className="traffic-dot dot-azure" title="Maximizar" />
                </div>
                <div className="screen-title">
                  <Terminal size={13} className="title-terminal-icon" />
                  <span>hacker-mentor://security-inspector.sh</span>
                </div>
                <div className="screen-status-badge">
                  <span className="live-dot" />
                  <span>Sistema Activo</span>
                </div>
              </div>

              {/* Contenido principal dentro de la pantalla */}
              <div className="screen-content">
                {/* Caja del Validador e Input */}
                <div className="terminal-input-container">
                  <div className="terminal-prompt-line">
                    <span className="prompt-user">auditor@hacker-mentor</span>
                    <span className="prompt-colon">:</span>
                    <span className="prompt-path">~/validador</span>
                    <span className="prompt-dollar">$</span>
                    <span className="prompt-cmd">evaluar-clave</span>
                  </div>

                  <div className="terminal-input-box">
                    <input
                      ref={inputRef}
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => onPasswordChange(e.target.value)}
                      placeholder="Escribe o pega una contraseña para evaluarla..."
                      className="screen-password-input"
                      autoComplete="off"
                      spellCheck="false"
                    />

                    <div className="terminal-input-actions">
                      {currentPassword && (
                        <button
                          type="button"
                          className="screen-tool-btn"
                          onClick={handleClear}
                          title="Borrar contraseña"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="screen-tool-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Botones de muestra rápida integrados en la pantalla */}
                  <div className="screen-samples-row">
                    <span className="screen-samples-label">Muestras del manual:</span>
                    <div className="screen-samples-list">
                      {MANUAL_SAMPLES.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="screen-sample-chip"
                          onClick={() => handleLoadSample(sample.password)}
                          title={sample.desc}
                        >
                          {sample.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Métricas de Fuerza Bruta y Diagnóstico */}
                <div className="screen-metrics-row">
                  <div className="screen-crack-card">
                    <div
                      className="screen-metric-icon"
                      style={{
                        backgroundColor: `${evaluation.tierColor}20`,
                        color: evaluation.tierColor,
                      }}
                    >
                      <Clock size={17} />
                    </div>
                    <div className="screen-metric-info">
                      <span className="metric-label">Tiempo estimado de fuerza bruta</span>
                      <span className="metric-value" style={{ color: evaluation.tierColor }}>
                        {evaluation.crackTime}
                      </span>
                    </div>
                  </div>

                  {evaluation.score === 100 && (
                    <div className="screen-certified-card">
                      <Sparkles size={16} className="certified-sparkle" />
                      <span>Certificación Hacker Mentor 100%</span>
                    </div>
                  )}
                </div>

                {/* Parámetros de Seguridad del Documento */}
                <div className="screen-criteria-wrapper">
                  <div className="screen-criteria-title">
                    <span>Parámetros de Seguridad Auditados (6 Criterios):</span>
                  </div>

                  <div className="screen-criteria-grid">
                    {evaluation.criteria.map((item) => (
                      <div
                        key={item.id}
                        className={`screen-criterion-card ${item.passed ? 'passed' : 'pending'}`}
                      >
                        <div className="criterion-indicator">
                          {item.passed ? (
                            <CheckCircle2 size={16} className="check-svg" />
                          ) : (
                            <AlertCircle size={16} className="pending-svg" />
                          )}
                        </div>
                        <div className="criterion-detail">
                          <span className="criterion-tag">{item.rule}</span>
                          <span className="criterion-name">{item.label}</span>
                          <span className="criterion-subtext">{item.hint}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* BARRA DE PROGRESO INFERIOR CON COLORES DINÁMICOS */}
              <div className="screen-progress-dock">
                <div className="dock-meta-info">
                  <div className="dock-tier-pill" style={{ borderColor: `${evaluation.tierColor}50` }}>
                    <span
                      className="dock-tier-dot"
                      style={{ backgroundColor: evaluation.tierColor }}
                    />
                    <span className="dock-tier-text" style={{ color: evaluation.tierColor }}>
                      {evaluation.tier}
                    </span>
                    <span className="dock-badge-sub">{evaluation.statusBadge}</span>
                  </div>

                  <div className="dock-score-wrap">
                    <span className="dock-score-num" style={{ color: evaluation.tierColor }}>
                      {evaluation.score}%
                    </span>
                    <span className="dock-score-label">Nivel de Fortaleza</span>
                  </div>
                </div>

                {/* Barra de progreso con gradiente dinámico */}
                <div className="dock-progress-track">
                  <div
                    className="dock-progress-fill"
                    style={{
                      width: `${evaluation.score}%`,
                      background: getProgressGradient(evaluation.score),
                      boxShadow:
                        evaluation.score >= 75
                          ? `0 0 12px ${evaluation.tierColor}60`
                          : 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Chin / Marco inferior del monitor */}
            <div className="monitor-chin">
              <div className="monitor-brand-logo">
                <span className="brand-dot" />
                <span className="brand-name">HACKER MENTOR DISPLAY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Soporte y Base de la Computadora */}
        <div className="computer-stand">
          <div className="stand-neck" />
          <div className="stand-base" />
        </div>
      </div>
    </section>
  );
}
