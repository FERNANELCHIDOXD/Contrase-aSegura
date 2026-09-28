import fs from 'fs';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
} from 'docx';

// Paleta de colores solicitada
const COLORS = {
  MAGENTA: 'DF52F0',
  AZURE: '1E8ADE',
  PURPLE: 'A130EF',
  COBALT: '273AEA',
  INDIGO: '511EEE',
  DARK_BG: '0C0A17',
  TEXT_MAIN: '222233',
  TEXT_MUTED: '666688',
  TABLE_HEADER: '273AEA',
  TABLE_ALT: 'F4F2FC',
  BORDER_COLOR: 'D8CEF6',
};

const cellBorder = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: COLORS.BORDER_COLOR,
};

const tableBorders = {
  top: cellBorder,
  bottom: cellBorder,
  left: cellBorder,
  right: cellBorder,
  insideHorizontal: cellBorder,
  insideVertical: cellBorder,
};

function createHeading(text, level, color = COLORS.INDIGO) {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 280, after: 120 },
    run: {
      color,
      bold: true,
      font: 'Arial',
    },
  });
}

function createParagraph(text, options = {}) {
  const { bold = false, italic = false, color = COLORS.TEXT_MAIN, spacing = { after: 120 } } = options;
  return new Paragraph({
    spacing,
    children: [
      new TextRun({
        text,
        bold,
        italic,
        color,
        font: 'Arial',
        size: 22, // 11pt
      }),
    ],
  });
}

function createBullet(title, desc) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [
      new TextRun({
        text: `${title}: `,
        bold: true,
        color: COLORS.INDIGO,
        font: 'Arial',
        size: 22,
      }),
      new TextRun({
        text: desc,
        color: COLORS.TEXT_MAIN,
        font: 'Arial',
        size: 22,
      }),
    ],
  });
}

function createTableHeaderCell(text, widthPercent) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: COLORS.TABLE_HEADER },
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: true,
            color: 'FFFFFF',
            font: 'Arial',
            size: 20,
          }),
        ],
      }),
    ],
  });
}

function createTableCell(text, widthPercent, isAlt = false, bold = false, color = COLORS.TEXT_MAIN) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: isAlt ? { type: ShadingType.CLEAR, fill: COLORS.TABLE_ALT } : undefined,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold,
            color,
            font: 'Arial',
            size: 19,
          }),
        ],
      }),
    ],
  });
}

async function buildDocx() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Arial',
            color: COLORS.TEXT_MAIN,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 pulgada
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Hacker Mentor — Validador & Generador de Contraseñas Seguras',
                    size: 16,
                    color: COLORS.TEXT_MUTED,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Página ',
                    size: 16,
                    color: COLORS.TEXT_MUTED,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: COLORS.TEXT_MUTED,
                  }),
                  new TextRun({
                    text: ' de ',
                    size: 16,
                    color: COLORS.TEXT_MUTED,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: COLORS.TEXT_MUTED,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // PORTADA / TÍTULO PRINCIPAL
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: 'DOCUMENTACIÓN TÉCNICA',
                bold: true,
                size: 40,
                color: COLORS.INDIGO,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Validador & Generador de Contraseñas Seguras',
                bold: true,
                size: 28,
                color: COLORS.AZURE,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'Basado en las directrices del "Manual Contraseñas S3guR4$_" de Hacker Mentor',
                italic: true,
                size: 22,
                color: COLORS.TEXT_MUTED,
                font: 'Arial',
              }),
            ],
          }),

          // TABLA DE METADATOS
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell('Parámetro', 30),
                  createTableHeaderCell('Detalle del Sistema', 70),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('Versión del Sistema', 30, false, true),
                  createTableCell('2.0.0 (Release Estable)', 70),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('Tecnologías', 30, true, true),
                  createTableCell('React 19, Vite 8, Lucide React, Canvas-Confetti, CSS3 Moderno', 70, true),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('Ubicación del Código', 30, false, true),
                  createTableCell('/home/yahirfsd/dev/contras', 70),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('Paleta Oficial Hex', 30, true, true),
                  createTableCell('#DF52F0, #1E8ADE, #A130EF, #273AEA, #511EEE', 70, true),
                ],
              }),
            ],
          }),

          // SECCIÓN 1: INTRODUCCIÓN
          createHeading('1. Introducción y Propósito del Sistema', HeadingLevel.HEADING_1),
          createParagraph(
            'El Validador & Generador de Contraseñas Seguras es una Single Page Application (SPA) reactiva construida con el objetivo de dotar a los usuarios de herramientas prácticas para crear y auditar contraseñas conforme a los principios expuestos en el "Manual Contraseñas S3guR4$_" publicado por Hacker Mentor.'
          ),
          createParagraph(
            'El sistema se divide en dos secciones operativas integradas en una sola página con desplazamiento fluido:'
          ),
          createBullet(
            'Sección 01 (Generador Heurístico)',
            'Transforma una palabra base o concepto cotidiano en 3 contraseñas seguras de ejemplo, ilustrando las técnicas de sustitución leet, frases secretas (passphrases) y cripto-híbridos de alta entropía.'
          ),
          createBullet(
            'Sección 02 (Estación de Trabajo / Computadora)',
            'Representa una computadora workstation interactiva cuya pantalla alberga un terminal de evaluación en tiempo real y una barra de progreso inferior con gradientes dinámicos.'
          ),

          // SECCIÓN 2: ARQUITECTURA
          createHeading('2. Arquitectura de Software y Flujo de Datos', HeadingLevel.HEADING_1),
          createParagraph(
            'La aplicación adopta una arquitectura desacoplada basada en componentes de React 19 y módulos funcionales puros de JavaScript:'
          ),
          createBullet(
            'App.jsx (Orquestador)',
            'Mantiene el estado compartido y la sincronización entre el generador y el validador, coordinando la transferencia de claves y el scroll animado.'
          ),
          createBullet(
            'Header.jsx',
            'Presenta la cabecera institucional, enlaces de anclaje y badges descriptivos del documento fuente.'
          ),
          createBullet(
            'PasswordGenerator.jsx',
            'Permite al usuario ingresar una palabra base, genera 3 sugerencias, ofrece copiado al portapapeles con confirmación visual y el botón "Probar en Validador".'
          ),
          createBullet(
            'PasswordValidator.jsx',
            'Modela la computadora workstation (bisel, cámara web, pantalla terminal, diagnóstico de 6 criterios, tarjeta de fuerza bruta y barra de progreso inferior reactiva).'
          ),
          createBullet(
            'utils/passwordGenerator.js',
            'Motor heurístico que implementa los algoritmos de sustitución leet, frases mnemotécnicas y tokens de alta entropía.'
          ),
          createBullet(
            'utils/passwordValidator.js',
            'Motor de evaluación matemática que verifica los 6 criterios del manual, calcula el puntaje (0-100%) y la estimación de fuerza bruta.'
          ),

          // SECCIÓN 3: ESPECIFICACIÓN DE ALGORITMOS
          createHeading('3. Especificación de Algoritmos Criptográficos y de Generación', HeadingLevel.HEADING_1),
          createParagraph(
            'A continuación se detallan las 3 técnicas empleadas en el generador basándose estrictamente en las reglas del documento:'
          ),

          createHeading('3.1. Técnica Leet / Sustitución Dinámica', HeadingLevel.HEADING_2, COLORS.COBALT),
          createParagraph(
            'Fundamentada en la Regla 3 del manual ("Si quieres usar palabras comunes, mezcla y reemplaza letras con mayúsculas, símbolos y números") y en el ejemplo textual T!g3rL!ly#2024!RunS.'
          ),
          createParagraph(
            'El algoritmo toma la palabra base del usuario, aplica un mapeo probabilístico de sustitución (a->4/@, e->3, i->1/!, o->0, s->$ y t->7), alterna mayúsculas y minúsculas, y concatena símbolos de control, un año representativo y un token alfanumérico seguro para garantizar una longitud final >= 14 caracteres.'
          ),

          createHeading('3.2. Frase Secreta / Passphrase Mnemotécnica', HeadingLevel.HEADING_2, COLORS.COBALT),
          createParagraph(
            'Fundamentada en la Regla 4 del manual ("Las frases largas y únicas son fáciles de recordar para ti, pero difíciles de adivinar para los atacantes") y en el ejemplo textual de la página 6 MisPerros3ComenGalletas!.'
          ),
          createParagraph(
            'El algoritmo combina un prefijo ("Mis", "Super", "Gran"), la palabra del usuario capitalizada, un dígito numérico, un verbo de acción ("Comen", "Saltan", "Vigilan", "Protegen"), un sustantivo complementario ("Galletas", "Galaxias", "Secretos") y un símbolo de cierre ("!", "#", "$"). Esto produce contraseñas de más de 20 caracteres altamente memorables y resistentes a fuerza bruta.'
          ),

          createHeading('3.3. Cripto-Híbrida de Máxima Entropía', HeadingLevel.HEADING_2, COLORS.COBALT),
          createParagraph(
            'Fundamentada en las Reglas 1 y 2 (longitud y combinación exhaustiva de caracteres). Envuelve la raíz de la palabra con un token prefijo aleatorio de símbolos y dos dígitos numéricos, junto con un sufijo de cuatro caracteres aleatorios mayúsculas y minúsculas.'
          ),

          // SECCIÓN 4: MOTOR DE VALIDACIÓN
          createHeading('4. Motor de Validación y Auditoría', HeadingLevel.HEADING_1),
          createParagraph(
            'La función validatePassword() audita la contraseña ingresada en tiempo real contra los 6 parámetros del manual:'
          ),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell('Criterio', 20),
                  createTableHeaderCell('Regla del Manual', 25),
                  createTableHeaderCell('Condición Auditada', 30),
                  createTableHeaderCell('Ponderación', 25),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('Longitud', 20, false, true),
                  createTableCell('Regla 1 (Longitud)', 25),
                  createTableCell('>= 12 caracteres (Bonus si >= 16)', 30),
                  createTableCell('Hasta 40 puntos', 25),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('Minúsculas', 20, true, true),
                  createTableCell('Regla 2 (Variedad)', 25, true),
                  createTableCell('Presencia de [a-z]', 30, true),
                  createTableCell('12.5 puntos', 25, true),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('Mayúsculas', 20, false, true),
                  createTableCell('Regla 2 (Variedad)', 25),
                  createTableCell('Presencia de [A-Z]', 30),
                  createTableCell('12.5 puntos', 25),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('Números', 20, true, true),
                  createTableCell('Regla 2 (Variedad)', 25, true),
                  createTableCell('Presencia de [0-9]', 30, true),
                  createTableCell('12.5 puntos', 25, true),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('Símbolos', 20, false, true),
                  createTableCell('Regla 2 (Variedad)', 25),
                  createTableCell('Presencia de [!@#$%^&*...]', 30),
                  createTableCell('12.5 puntos', 25),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('Sin Obviedades', 20, true, true),
                  createTableCell('Regla 3 (Evita lo obvio)', 25, true),
                  createTableCell('Sin palabras comunes ("password"), secuencias ("123") ni repeticiones', 30, true),
                  createTableCell('+10 pts / -25 penalización', 25, true),
                ],
              }),
            ],
          }),

          createHeading('4.1. Estimación de Fuerza Bruta', HeadingLevel.HEADING_2, COLORS.COBALT),
          createParagraph(
            'El sistema modela el espacio de combinaciones posibles C = N^L, donde N es el tamaño del conjunto de caracteres presentes (hasta 95 caracteres imprimibles) y L es la longitud. Se asume un clúster de fuerza bruta atacante con capacidad de 10 mil millones (10^10) de hashes por segundo, proyectando tiempos desde "Instantáneo" hasta "Trillones de siglos".'
          ),

          // SECCIÓN 5: DISEÑO Y PALETA
          createHeading('5. Sistema de Diseño e Identidad Visual', HeadingLevel.HEADING_1),
          createParagraph(
            'El diseño se basa en una estética minimalista moderna con una paleta de 5 colores de alto impacto visual:'
          ),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell('Código Hex', 20),
                  createTableHeaderCell('Nombre', 25),
                  createTableHeaderCell('Función en la Interfaz', 35),
                  createTableHeaderCell('Nivel Asociado', 20),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('#DF52F0', 20, false, true, COLORS.MAGENTA),
                  createTableCell('Bright Magenta', 25),
                  createTableCell('Indicador de alerta, estado pendiente y dot de cierre', 35),
                  createTableCell('Muy Débil (0-24%)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('#A130EF', 20, true, true, COLORS.PURPLE),
                  createTableCell('Vivid Violet', 25, true),
                  createTableCell('Bordes sutiles, dot de minimizado y etiquetas de reglas', 35, true),
                  createTableCell('Débil (25-49%)', 20, true),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('#511EEE', 20, false, true, COLORS.INDIGO),
                  createTableCell('Deep Electric Indigo', 25),
                  createTableCell('Fondos de cards, superficies elevadas y botones base', 35),
                  createTableCell('Aceptable (50-74%)', 20),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('#273AEA', 20, true, true, COLORS.COBALT),
                  createTableCell('Royal Cobalt Blue', 25, true),
                  createTableCell('Degradados de acción primaria e inicio de nivel robusto', 35, true),
                  createTableCell('Segura (75-89%)', 20, true),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('#1E8ADE', 20, false, true, COLORS.AZURE),
                  createTableCell('Electric Azure Blue', 25),
                  createTableCell('Checkmarks aprobados, terminal prompt y nivel máximo', 35),
                  createTableCell('Hacker Mentor (90-100%)', 20),
                ],
              }),
            ],
          }),

          createHeading('5.1. Computadora Workstation (Sección 02)', HeadingLevel.HEADING_2, COLORS.COBALT),
          createParagraph(
            'La Sección 02 simula un equipo informático completo compuesto por un monitor de bordes biselados oscuros con cámara web y LED activo, una pantalla interna con apariencia de terminal Unix/Security OS, soporte y base de escritorio física, y una barra de progreso integrada en el dock inferior con gradientes fluidos y celebración con confeti al alcanzar el 100%.'
          ),

          // SECCIÓN 6: GUÍA DE DESPLIEGUE
          createHeading('6. Guía de Ejecución y Compilación', HeadingLevel.HEADING_1),
          createParagraph(
            'El proyecto cuenta con un entorno preconfigurado con Vite y Oxlint en /home/yahirfsd/dev/contras:'
          ),
          createBullet('Iniciar entorno de desarrollo', 'pnpm run dev (Servidor local en http://localhost:5173/)'),
          createBullet('Análisis estático de código', 'pnpm run lint (Ejecuta Oxlint sin errores ni advertencias)'),
          createBullet('Compilación de producción', 'pnpm run build (Genera paquete ultraligero optimizado en dist/)'),
          createBullet('Previsualización del build', 'pnpm run preview (Servidor HTTP local sobre los archivos compilados)'),

          // SECCIÓN 7: RESULTADOS DE PRUEBAS
          createHeading('7. Matriz de Pruebas y Casos de Validación', HeadingLevel.HEADING_1),
          createParagraph(
            'Las pruebas unitarias y de integración realizadas sobre el sistema arrojaron los siguientes resultados:'
          ),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell('Caso de Prueba', 30),
                  createTableHeaderCell('Entrada Evaluada', 25),
                  createTableHeaderCell('Puntaje y Nivel Obtenido', 30),
                  createTableHeaderCell('Estado', 15),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('Ejemplo Manual Pág. 6', 30, false, true),
                  createTableCell('MisPerros3ComenGalletas!', 25),
                  createTableCell('100% — Nivel Hacker Mentor', 30),
                  createTableCell('APROBADO', 15, false, true, COLORS.AZURE),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('Ejemplo Manual Pág. 11', 30, true, true),
                  createTableCell('T!g3rL!ly#2024!RunS', 25, true),
                  createTableCell('100% — Nivel Hacker Mentor', 30, true),
                  createTableCell('APROBADO', 15, true, true, COLORS.AZURE),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('Secuencia Insegura', 30, false, true),
                  createTableCell('123456', 25),
                  createTableCell('10% — Muy Débil (Instantáneo)', 30),
                  createTableCell('APROBADO', 15, false, true, COLORS.AZURE),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('Palabra Común', 30, true, true),
                  createTableCell('password123', 25, true),
                  createTableCell('18% — Muy Débil (Penalizada)', 30, true),
                  createTableCell('APROBADO', 15, true, true, COLORS.AZURE),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell('Generador por Palabra', 30, false, true),
                  createTableCell('perro / galleta / ciber', 25),
                  createTableCell('3 contraseñas >= 14 chars, >= 92%', 30),
                  createTableCell('APROBADO', 15, false, true, COLORS.AZURE),
                ],
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 120 },
            children: [
              new TextRun({
                text: '— Fin del Documento Técnico —',
                bold: true,
                size: 20,
                color: COLORS.TEXT_MUTED,
                font: 'Arial',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  
  // Guardar en la raíz del proyecto
  const targetRepo = '/home/yahirfsd/dev/contras/DOCUMENTACION_TECNICA.docx';
  fs.writeFileSync(targetRepo, buffer);
  console.log('Archivo creado exitosamente en:', targetRepo);

  // Guardar también en la carpeta Descargas para fácil acceso del usuario
  const targetDescargas = '/home/yahirfsd/Descargas/DOCUMENTACION_TECNICA.docx';
  try {
    fs.writeFileSync(targetDescargas, buffer);
    console.log('Archivo copiado exitosamente en:', targetDescargas);
  } catch (err) {
    console.error('No se pudo copiar a Descargas:', err);
  }
}

buildDocx().catch(console.error);
