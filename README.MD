# 🎨 Colorfly Studio

Generador de paletas de colores interactivo, construido con TypeScript y Vite.

## 📌 Descripción

Colorfly Studio es una aplicación web para generar paletas de colores de forma dinámica y rápida. Permite elegir la cantidad de colores, el formato (HEX o HSL) y el estilo de armonía cromática, copiar cualquier código al portapapeles con un clic, fijar colores individuales para que no cambien al regenerar, y guardar las paletas favoritas para consultarlas después.

Originalmente desarrollado como Proyecto Integrador del Módulo 1 (HTML, CSS y JavaScript vanilla), fue reescrito en TypeScript para aplicar tipado estático, eliminar duplicación de código y mejorar la accesibilidad, y luego ampliado con funciones de generación inteligente de paletas.

## 🚀 Demo

🔗 https://color-palette-generator-nine-delta.vercel.app/

## 🛠️ Tecnologías utilizadas

- TypeScript
- Vite
- HTML5 semántico
- CSS3 (custom properties, grid, animaciones, responsive)

## ✨ Funcionalidades

- Generación aleatoria de paletas de 6, 8 o 9 colores.
- Formato configurable: HEX o HSL.
- **Modos de armonía cromática**: además del modo aleatorio, permite generar paletas basadas en teoría del color —*armonioso* (colores análogos), *alto contraste* (complementarios) y *balanceado* (tríada)—, cada uno con una descripción en lenguaje simple.
- **Nombre poético automático**: cada paleta generada recibe un nombre evocador (ej. "Bruma violeta") calculado según el matiz dominante de sus colores.
- **Candado por color**: cada color individual puede fijarse para que no cambie al generar una nueva paleta, permitiendo iterar sobre una combinación manteniendo los colores que ya funcionan.
- Copiado al portapapeles con feedback visual (tooltip + micro-animación de "salto" en el color).
- Guardado de paletas favoritas, con prevención de duplicados.
- Eliminación individual o total de paletas guardadas.
- Pantalla de bienvenida animada al cargar la app.
- Interfaz accesible: elementos interactivos son `<button>` navegables por teclado, con estados de foco visibles y soporte para `prefers-reduced-motion`.
- Diseño responsive.

## 🧠 Decisiones técnicas

- **TypeScript en vez de JS vanilla**: tipado explícito (`ColorFormat`, `HarmonyMode`, `PaletteColor`) para prevenir errores en tiempo de desarrollo.
- **Sin duplicación de lógica**: la función de copiar al portapapeles y mostrar el tooltip está centralizada, reutilizada tanto en la paleta generada como en las guardadas.
- **Generación de armonías en espacio HSL**: los modos análogo, complementario y tríada calculan matices (`hue`) relacionados matemáticamente en el círculo cromático, y convierten a HEX cuando corresponde con una función propia de conversión HSL → HEX.
- **Accesibilidad**: los colores son `<button>` con `aria-label` descriptivo, en vez de `<div>` con `onclick`, para que sean operables con teclado y lectores de pantalla.
- **`navigator.clipboard.writeText` con manejo de errores**: si falla la copia (permisos del navegador), se muestra feedback en vez de fallar en silencio.
- **Sin "magic numbers"**: duraciones y valores repetidos están declarados como constantes con nombre.
- **Vite** como bundler, por consistencia con el resto del portfolio y para tener HMR en desarrollo.

## 💻 Instalación local

```bash
git clone https://github.com/NadiaStarna/color-palette-generator.git
cd color-palette-generator
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Build de producción

```bash
npm run build
npm run preview
```

## 📦 Cómo usar la app

1. Elegir la cantidad de colores (6, 8 o 9), el formato (HEX o HSL) y el estilo de armonía.
2. Presionar **Generar paleta**.
3. Hacer clic sobre cualquier color para copiar su código al portapapeles.
4. Usar el candado de un color para fijarlo: al generar de nuevo, ese color se mantiene y solo cambian los demás.
5. Presionar **Guardar paleta** para conservarla en la sección de guardadas.
6. Desde las paletas guardadas: clic en un color para copiarlo, clic en la **×** para eliminar esa paleta puntual, o **Limpiar guardadas** para borrarlas todas.

## 🤖 Uso de Inteligencia Artificial

Se utilizó IA (Claude) como apoyo para revisar el código original, migrarlo a TypeScript, corregir duplicación de lógica, mejorar la accesibilidad, e implementar la generación de armonías cromáticas y el sistema de nombres de paleta. El código resultante fue revisado y comprendido en su totalidad.

## 📌 Autora

Nadia Starna — [GitHub](https://github.com/NadiaStarna)