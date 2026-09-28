/**
 * Utilidades de validación de contraseñas basadas en el
 * "Manual Contraseñas S3guR4$_" de Hacker Mentor.
 */

// Lista de palabras y patrones comunes obvios a penalizar (Regla 3)
const COMMON_PATTERNS = [
  'password',
  '123456',
  '12345678',
  '123456789',
  'contrasena',
  'contrase\u00f1a',
  'qwerty',
  'admin',
  'welcome',
  'login',
  'abc123',
  'monkey',
  'iloveyou',
  'superman',
  'hacker',
];

/**
 * Calcula la estimación pedagógica de tiempo de fuerza bruta
 */
function estimateCrackTime(charPoolSize, length) {
  if (length === 0) return '0 segundos';
  if (length < 6) return 'Instantáneo';

  // Combinaciones = N^L
  // Suponiendo un cluster de atacantes de 10 mil millones (1e10) hashes/segundo
  const hashesPerSecond = 1e10;
  const combinations = Math.pow(charPoolSize, length);
  const seconds = combinations / hashesPerSecond;

  if (seconds < 1) return 'Menos de 1 segundo (Instantáneo)';
  if (seconds < 60) return `${Math.round(seconds)} segundos`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutos`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} horas`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} días`;
  if (seconds < 31536000 * 100) return `${Math.round(seconds / 31536000)} años`;
  if (seconds < 31536000 * 1000000) return `${(seconds / (31536000 * 1000)).toFixed(0)} mil años`;
  if (seconds < 31536000 * 1e9) return `${(seconds / (31536000 * 1e6)).toFixed(1)} millones de años`;
  return 'Trillones de siglos';
}

/**
 * Evalúa una contraseña contra las reglas del manual
 */
export function validatePassword(password = '') {
  const pwd = password || '';
  const length = pwd.length;

  // 1. Regla 1: Longitud (al menos 12 caracteres)
  const isLengthAtLeast12 = length >= 12;
  const isLengthBonus = length >= 16;

  // 2. Regla 2: Variedad de caracteres
  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSymbol = /[^a-zA-Z0-9\s]/.test(pwd);

  // 3. Regla 3: Evitar lo obvio y repeticiones
  const lowerPwd = pwd.toLowerCase();
  const containsCommonWord = COMMON_PATTERNS.some((pat) => lowerPwd.includes(pat));
  const hasConsecutiveRepeats = /(.)\1{2,}/.test(pwd); // 3 o más iguales seguidos: 'aaa', '111'
  const isSequentialNumbers = /(?:012|123|234|345|456|567|678|789)/.test(pwd);
  const noObviousPatterns = !containsCommonWord && !hasConsecutiveRepeats && !isSequentialNumbers;

  // Cálculo de pool de caracteres para entropía
  let charPoolSize = 0;
  if (hasLower) charPoolSize += 26;
  if (hasUpper) charPoolSize += 26;
  if (hasNumber) charPoolSize += 10;
  if (hasSymbol) charPoolSize += 33;

  // Cálculo de puntuación (0 a 100)
  let score = 0;

  if (length > 0) {
    // Puntos por longitud (máximo 40 pts)
    if (length >= 16) score += 40;
    else if (length >= 12) score += 32;
    else if (length >= 8) score += 18;
    else score += Math.floor((length / 8) * 10);

    // Puntos por variedad (12.5 pts cada uno, total 50 pts)
    if (hasLower) score += 12.5;
    if (hasUpper) score += 12.5;
    if (hasNumber) score += 12.5;
    if (hasSymbol) score += 12.5;

    // Puntos por evitar patrones obvios (10 pts)
    if (noObviousPatterns && length >= 8) {
      score += 10;
    } else if (!noObviousPatterns) {
      score = Math.max(10, score - 25); // Penalización severa por usar '123456', 'password', etc.
    }
  }

  // Redondear y limitar a 0 - 100
  score = Math.min(100, Math.max(0, Math.round(score)));

  // Clasificación cualitativa según la nueva paleta solicitada
  let tier = 'Muy Débil';
  let tierColor = '#DF52F0'; // Bright Magenta
  let statusBadge = 'Insegura';

  if (score >= 90) {
    tier = 'Nivel Hacker Mentor';
    tierColor = '#1E8ADE'; // Electric Azure Blue
    statusBadge = 'Ultra Segura';
  } else if (score >= 75) {
    tier = 'Segura';
    tierColor = '#273AEA'; // Royal Cobalt Blue
    statusBadge = 'Robusta';
  } else if (score >= 50) {
    tier = 'Aceptable';
    tierColor = '#511EEE'; // Deep Electric Indigo
    statusBadge = 'Media';
  } else if (score >= 25) {
    tier = 'Débil';
    tierColor = '#A130EF'; // Vivid Violet
    statusBadge = 'Vulnerable';
  }

  // Estimación de tiempo para descifrar
  const crackTime = estimateCrackTime(charPoolSize || 1, length);

  // Lista detallada de criterios del manual
  const criteria = [
    {
      id: 'length',
      rule: 'Regla 1: Longitud de la Contraseña',
      label: 'Al menos 12 caracteres',
      hint: length >= 12 ? (isLengthBonus ? `${length} caracteres (Excelente longitud)` : `${length}/12 caracteres cumplidos`) : `${length}/12 caracteres (Complícale la tarea a atacantes)`,
      passed: isLengthAtLeast12,
      critical: true,
    },
    {
      id: 'lower',
      rule: 'Regla 2: Variedad de Caracteres',
      label: 'Letras minúsculas (a-z)',
      hint: hasLower ? 'Contiene minúsculas' : 'Añade letras minúsculas',
      passed: hasLower,
      critical: true,
    },
    {
      id: 'upper',
      rule: 'Regla 2: Variedad de Caracteres',
      label: 'Letras mayúsculas (A-Z)',
      hint: hasUpper ? 'Contiene mayúsculas' : 'Añade letras mayúsculas',
      passed: hasUpper,
      critical: true,
    },
    {
      id: 'number',
      rule: 'Regla 2: Variedad de Caracteres',
      label: 'Números (0-9)',
      hint: hasNumber ? 'Contiene dígitos numéricos' : 'Añade números',
      passed: hasNumber,
      critical: true,
    },
    {
      id: 'symbol',
      rule: 'Regla 2: Variedad de Caracteres',
      label: 'Símbolos especiales (!, @, #, $, %, etc.)',
      hint: hasSymbol ? 'Contiene caracteres especiales' : 'Añade símbolos especiales',
      passed: hasSymbol,
      critical: true,
    },
    {
      id: 'noObvious',
      rule: 'Regla 3: Evita lo Obvio',
      label: 'Sin palabras comunes ni secuencias obvias',
      hint: noObviousPatterns
        ? 'No se detectaron secuencias o palabras típicas'
        : 'Evita palabras como "password", secuencias ("123", "qwerty") o repeticiones',
      passed: noObviousPatterns && length > 0,
      critical: false,
    },
  ];

  const allPassed = criteria.every((c) => c.passed);

  return {
    score,
    tier,
    tierColor,
    statusBadge,
    crackTime,
    criteria,
    allPassed,
    length,
  };
}
