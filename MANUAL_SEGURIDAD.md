# Documentación Técnica: Contraseña Segura

Esta documentación detalla la arquitectura, tecnologías y funcionamiento interno del proyecto **Contraseña Segura** (Validador y Generador de Contraseñas).

## 1. Propósito del Proyecto (¿Para qué se hizo?)

La aplicación fue desarrollada como una herramienta educativa e interactiva para ayudar a los usuarios a crear y evaluar contraseñas fuertes. Su diseño está orientado a gamificar la experiencia de la ciberseguridad, permitiendo a los usuarios:
1. **Generar** contraseñas robustas a partir de palabras base fáciles de recordar.
2. **Validar** contraseñas en tiempo real, obteniendo métricas visuales sobre el tiempo estimado de descifrado por fuerza bruta y retroalimentación sobre qué criterios de seguridad deben mejorar.

Se construyó con base en las mejores prácticas de seguridad, exigiendo un mínimo de caracteres, el uso de símbolos, y penalizando secuencias obvias.

---

## 2. Tecnologías y Stack (¿Con qué se hizo?)

El proyecto es una Single Page Application (SPA) moderna, construida con el siguiente stack tecnológico:

* **Framework Principal:** React 19 (Uso intensivo de Functional Components y Hooks como `useState`, `useEffect` y `useRef`).
* **Empaquetador (Bundler):** Vite (Proporciona un entorno de desarrollo extremadamente rápido y optimización en producción).
* **Gestor de Paquetes:** pnpm.
* **Estilizado:** CSS Vanilla (Clases personalizadas para construir una interfaz inmersiva inspirada en "terminales de hackers" y workstations modernas, sin depender de frameworks de CSS pesados).
* **Librerías Adicionales:**
  * `lucide-react`: Para la iconografía vectorial (Iconos escalables y consistentes).
  * `canvas-confetti`: Para la retroalimentación visual positiva (efectos de celebración) cuando el usuario alcanza el 100% de seguridad en el validador.
* **Herramientas de Calidad de Código:** `oxlint` para el análisis estático y linting del código JavaScript/React.

---

## 3. Estructura y Componentes Principales (¿Cómo se hizo?)

El código fuente está estructurado separando la lógica de la interfaz visual (UI):

### Interfaz de Usuario (`src/components/`)
1. **`Header.jsx`**: Componente de presentación superior que contiene el título de la aplicación, una descripción concisa y la navegación hacia los módulos principales.
2. **`PasswordGenerator.jsx`**: Módulo interactivo donde el usuario ingresa una palabra base. Al enviar la petición, interactúa con la lógica de negocio para generar 3 variantes de contraseñas de alta entropía. Permite copiar las contraseñas al portapapeles y pasarlas al validador.
3. **`PasswordValidator.jsx`**: Es el componente más complejo de la UI. Emula visualmente un entorno de terminal ("auditor@hacker-mentor"). 
   - Contiene un *input* (con longitud máxima de 128 caracteres) donde se evalúa cada pulsación de tecla.
   - Renderiza dinámicamente barras de progreso, iconos de estado y etiquetas basadas en el puntaje de seguridad (0 a 100%).

### Lógica de Negocio (`src/utils/`)
La aplicación delega la evaluación y generación a archivos utilitarios puros, lo que facilita el testing y el mantenimiento:
1. **`passwordValidator.js`**: Contiene la lógica para evaluar la entropía de la contraseña. Verifica 6 criterios fundamentales (longitud, uso de mayúsculas/minúsculas, símbolos, números, evitar patrones repetitivos y evitar patrones obvios) y calcula un tiempo hipotético de descifrado por fuerza bruta.
2. **`passwordGenerator.js`**: Recibe una palabra base y aplica transformaciones tipo *Leet Speak* (ej. "e" por "3", "a" por "@") junto con prefijos/sufijos aleatorios y símbolos para asegurar que la contraseña generada apruebe todas las validaciones de seguridad.

---

## 4. Flujo de Funcionamiento (¿Cómo funciona?)

El ciclo de vida de la interacción en la aplicación sigue este flujo:

1. **Entrada en el Generador:** El estado inicial de la palabra base se almacena mediante `useState` (ej. "perro"). Cuando el usuario hace clic en generar, la función `generatePasswordSuggestions` transforma la palabra devolviendo un array de sugerencias.
2. **Validación Reactiva:** 
   - El usuario introduce o pega una contraseña en el `PasswordValidator`.
   - El evento `onChange` actualiza el estado `currentPassword`.
   - Se invoca la función `validatePassword(currentPassword)`, la cual evalúa la cadena y devuelve un objeto de estado completo: `score`, `tier`, `crackTime`, y un array de `criteria` evaluados.
3. **Retroalimentación Visual:** El componente React vuelve a renderizarse con el nuevo objeto de validación:
   - Si un criterio falla, se marca en rojo/amarillo.
   - La barra de progreso crece y cambia su gradiente de color según el `score`.
   - **Micro-interacción:** Si el `score` alcanza 100 por primera vez, un `useEffect` se dispara invocando a `canvas-confetti` para felicitar al usuario.
