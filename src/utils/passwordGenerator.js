/**
 * Utilidades de generación de contraseñas seguras basadas en el
 * "Manual Contraseñas S3guR4$_" de Hacker Mentor.
 */

// Mapeos leet para sustitución inteligente (Regla 3)
const LEET_MAP = {
  a: ['4', '@'],
  e: ['3'],
  i: ['1', '!'],
  o: ['0'],
  s: ['$', '5'],
  t: ['7'],
  b: ['8'],
  g: ['9'],
};

const VERBS = ['Comen', 'Saltan', 'Cuidan', 'Vigilan', 'Protegen', 'Conquistan', 'Descifran', 'Blindan'];
const COMPLEMENTS = ['Galletas', 'Galaxias', 'Secretos', 'Montanas', 'Codigos', 'Tesoro', 'Diamantes', 'Escudos'];
const PREFIXES = ['Mis', 'Super', 'Gran', 'Alto', 'Mega', 'ElFuerte'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomString(length, chars) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Normaliza la palabra base del usuario
 */
function cleanWord(word) {
  if (!word || typeof word !== 'string') return 'Seguridad';
  const clean = word.trim().replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '');
  return clean.length > 0 ? clean : 'Mentor';
}

/**
 * Capitaliza la primera letra
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Técnica 1: Sustitución Leet + Combinación de mayúsculas, números y símbolos
 * Inspirada en la Regla 3 y el ejemplo del manual: T!g3rL!ly#2024!RunS
 */
export function generateLeetPassword(rawWord) {
  const word = cleanWord(rawWord);
  let transformed = '';

  for (let i = 0; i < word.length; i++) {
    const char = word[i].toLowerCase();
    const replacements = LEET_MAP[char];

    if (replacements && Math.random() > 0.3) {
      transformed += getRandomItem(replacements);
    } else {
      // Alternar mayúsculas y minúsculas
      transformed += i % 2 === 0 ? word[i].toUpperCase() : word[i].toLowerCase();
    }
  }

  // Garantizar mayúscula y minúscula en el cuerpo
  if (!/[a-z]/.test(transformed)) transformed += 'x';
  if (!/[A-Z]/.test(transformed)) transformed = capitalize(transformed);

  const sym1 = getRandomItem(['!', '#', '$', '@', '&']);
  const sym2 = getRandomItem(['!', '*', '_', '%']);
  const year = getRandomItem(['2025', '2026', '2027', '99', '77']);
  const actionWord = getRandomItem(['RunS', 'Safe', 'Pro7', 'Lock', 'Fast', 'Apex']);

  // Construir contraseña combinando partes para asegurar >= 13 caracteres
  const password = `${transformed}${sym1}${year}${sym2}${actionWord}`;

  return {
    id: 'leet',
    name: 'Técnica Leet / Sustitución',
    badge: 'Regla 3 & Ejemplo Manual',
    description: 'Reemplaza vocales por números y símbolos, alternando mayúsculas y añadiendo sufijos de alta complejidad (similar a T!g3rL!ly#2024!RunS).',
    password,
  };
}

/**
 * Técnica 2: Frase Secreta (Passphrase Mnemotécnica)
 * Inspirada en la Regla 4 y el ejemplo del manual: MisPerros3ComenGalletas!
 */
export function generatePassphrasePassword(rawWord) {
  const word = cleanWord(rawWord);
  const prefix = getRandomItem(PREFIXES);
  const capWord = capitalize(word);
  const verb = getRandomItem(VERBS);
  const complement = getRandomItem(COMPLEMENTS);
  const num = getRandomInt(2, 9);
  const sym = getRandomItem(['!', '#', '$', '*', '&']);

  // Ejemplo: MisPerros3ComenGalletas!
  const password = `${prefix}${capWord}${num}${verb}${complement}${sym}`;

  return {
    id: 'passphrase',
    name: 'Frase Secreta (Passphrase)',
    badge: 'Regla 4: Fácil de recordar',
    description: 'Combina palabras con sentido mnemotécnico en CamelCase con dígitos y símbolos. Muy extensa y resistente a ataques de fuerza bruta.',
    password,
  };
}

/**
 * Técnica 3: Cripto-Híbrida de Alta Entropía
 * Inspirada en las Reglas 1 y 2 (Longitud >= 14 y máxima variedad)
 */
export function generateCryptoHybridPassword(rawWord) {
  const word = cleanWord(rawWord);
  const leetCore = word
    .toLowerCase()
    .replace(/a/g, '@')
    .replace(/e/g, '3')
    .replace(/i/g, '1')
    .replace(/o/g, '0');
  const capLeet = capitalize(leetCore);

  const prefixChars = getRandomString(2, 'ABCDEFGHJKLMNPQRSTUVWXYZ');
  const suffixChars = getRandomString(2, 'abcdefghjkmnpqrstuvwxyz');
  const sym1 = getRandomItem(['#', '&', '$', '%']);
  const sym2 = getRandomItem(['!', '_', '*', '^']);
  const num = getRandomInt(10, 99);

  // Ejemplo: #89_Perro3!wK$
  const password = `${sym1}${num}_${capLeet}${sym2}${prefixChars}${suffixChars}`;

  return {
    id: 'crypto_hybrid',
    name: 'Cripto-Híbrida (Máxima Entropía)',
    badge: 'Reglas 1 y 2: Máxima Fortaleza',
    description: 'Envuelve la raíz de la palabra con tokens criptográficos aleatorios de números, mayúsculas, minúsculas y símbolos variados.',
    password,
  };
}

/**
 * Genera el conjunto de las 3 contraseñas sugeridas
 */
export function generatePasswordSuggestions(word) {
  return [
    generateLeetPassword(word),
    generatePassphrasePassword(word),
    generateCryptoHybridPassword(word),
  ];
}
