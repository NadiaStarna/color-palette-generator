// ==========================
// Splash screen de bienvenida
// ==========================
const splashScreen = document.getElementById("splash-screen") as HTMLElement | null;

function dismissSplash(): void {
  if (!splashScreen) return;
  splashScreen.remove();
}

if (splashScreen) {
  splashScreen.addEventListener("click", dismissSplash);
  splashScreen.addEventListener("animationend", (event) => {
    if (event.target === splashScreen) {
      dismissSplash();
    }
  });
}

// ==========================
// Tipos
// ==========================
type ColorFormat = "hex" | "hsl";
type HarmonyMode = "random" | "analogous" | "complementary" | "triad";

interface PaletteColor {
  value: string;
  locked: boolean;
  hue: number;
}

// ==========================
// Constantes
// ==========================
const TOOLTIP_VISIBLE_MS = 1500;
const SWATCH_POP_MS = 150;
const HEX_CHARS = "0123456789ABCDEF";

const HARMONY_DESCRIPTIONS: Record<HarmonyMode, string> = {
  random: "Colores totalmente al azar, sin relación entre sí.",
  analogous: "Colores vecinos entre sí: combinan de forma natural.",
  complementary: "El color base y su opuesto: ideal para resaltar algo.",
  triad: "Tres familias de color equilibradas entre sí, con variedad.",
};

// ==========================
// Elementos del DOM
// ==========================
const generateBtn = document.getElementById("generate-btn") as HTMLButtonElement;
const paletteContainer = document.getElementById("palette-container") as HTMLElement;
const colorCountSelect = document.getElementById("color-count") as HTMLSelectElement;
const colorTypeSelect = document.getElementById("color-type") as HTMLSelectElement;
const harmonyModeSelect = document.getElementById("harmony-mode") as HTMLSelectElement;
const harmonyDescription = document.getElementById("harmony-description") as HTMLElement;
const paletteNameEl = document.getElementById("palette-name") as HTMLElement;

const saveButton = document.getElementById("savePalette") as HTMLButtonElement;
const clearButton = document.getElementById("clearPalettes") as HTMLButtonElement;
const savedContainer = document.querySelector(".saved-palettes") as HTMLElement;
const tooltip = document.getElementById("tooltip") as HTMLElement;

// Estado de la paleta actual, incluye qué colores están fijados
let currentPalette: PaletteColor[] = [];

// Guarda las paletas ya guardadas (como string) para evitar duplicados
const savedPalettesData: string[] = [];

// ==========================
// Conversión de color
// ==========================
function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) =>
    light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const toHex = (n: number) =>
    Math.round(255 * f(n))
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();

  return `#${toHex(0)}${toHex(8)}${toHex(4)}`;
}

function colorFromHsl(h: number, s: number, l: number, type: ColorFormat): string {
  const hue = Math.round(((h % 360) + 360) % 360);
  return type === "hex" ? hslToHex(hue, s, l) : `hsl(${hue}, ${s}%, ${l}%)`;
}

// ==========================
// Generación de color por modo de armonía
// ==========================
function randomHexColor(): string {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
  }
  return color;
}

function randomHslColor(): string {
  const h = Math.floor(Math.random() * 361);
  const s = Math.floor(Math.random() * 101);
  const l = Math.floor(Math.random() * 101);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function pleasantSat(): number {
  return 55 + Math.floor(Math.random() * 30); // 55-85%
}

function pleasantLight(): number {
  return 40 + Math.floor(Math.random() * 25); // 40-65%
}

function buildHues(mode: HarmonyMode, count: number, baseHue: number): number[] {
  const hues: number[] = [];

  if (mode === "analogous") {
    const spread = 12;
    for (let i = 0; i < count; i++) {
      hues.push(baseHue + (i - Math.floor(count / 2)) * spread);
    }
  } else if (mode === "complementary") {
    for (let i = 0; i < count; i++) {
      const anchor = i % 2 === 0 ? baseHue : baseHue + 180;
      hues.push(anchor + (Math.random() * 16 - 8));
    }
  } else if (mode === "triad") {
    const anchors = [baseHue, baseHue + 120, baseHue + 240];
    for (let i = 0; i < count; i++) {
      hues.push(anchors[i % 3] + (Math.random() * 14 - 7));
    }
  }

  return hues;
}

function generatePaletteColors(
  mode: HarmonyMode,
  count: number,
  type: ColorFormat,
): PaletteColor[] {
  if (mode === "random") {
    return Array.from({ length: count }, () => {
      const value = type === "hex" ? randomHexColor() : randomHslColor();
      return { value, locked: false, hue: Math.floor(Math.random() * 360) };
    });
  }

  const baseHue = Math.floor(Math.random() * 360);
  const hues = buildHues(mode, count, baseHue);

  return hues.map((hue) => ({
    value: colorFromHsl(hue, pleasantSat(), pleasantLight(), type),
    locked: false,
    hue,
  }));
}

// ==========================
// Nombre poético de la paleta
// ==========================
const NAME_PREFIXES = ["Bruma", "Eco", "Pulso", "Susurro", "Destello", "Marea", "Vértigo", "Aurora", "Deriva", "Eclipse"];

function familyFromHue(hue: number): string {
  const h = ((hue % 360) + 360) % 360;
  if (h < 15 || h >= 345) return "rojo coral";
  if (h < 45) return "naranja arcilla";
  if (h < 70) return "amarillo miel";
  if (h < 150) return "verde esmeralda";
  if (h < 200) return "verde azulado";
  if (h < 255) return "azul océano";
  if (h < 290) return "violeta";
  if (h < 320) return "magenta";
  return "rosa";
}

function generatePaletteName(hues: number[]): string {
  if (hues.length === 0) return "";
  const baseHue = hues[0];
  const prefix = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
  const family = familyFromHue(baseHue);
  return `${prefix} ${family}`;
}

// ==========================
// Copiar al portapapeles + feedback visual
// ==========================
let tooltipTimeoutId: number | undefined;

async function copyColorToClipboard(color: string, boxEl: HTMLElement): Promise<void> {
  boxEl.classList.add("pop");
  window.setTimeout(() => boxEl.classList.remove("pop"), SWATCH_POP_MS);

  try {
    await navigator.clipboard.writeText(color);
    showTooltip(`${color} copiado ✨`);
  } catch (error) {
    showTooltip("No se pudo copiar el color");
    console.error("Error al copiar al portapapeles:", error);
  }
}

function showTooltip(message: string): void {
  window.clearTimeout(tooltipTimeoutId);
  tooltip.textContent = message;
  tooltip.classList.add("visible");
  tooltipTimeoutId = window.setTimeout(() => {
    tooltip.classList.remove("visible");
  }, TOOLTIP_VISIBLE_MS);
}

// ==========================
// Render de un color individual (usado en paleta y en guardadas)
// ==========================
function createColorSwatch(color: string, className: string): HTMLButtonElement {
  const swatch = document.createElement("button");
  swatch.type = "button";
  swatch.className = className;
  swatch.style.backgroundColor = color;
  swatch.setAttribute("aria-label", `Copiar color ${color}`);
  swatch.addEventListener("click", () => copyColorToClipboard(color, swatch));
  return swatch;
}

function createLockButton(index: number): HTMLButtonElement {
  const lockBtn = document.createElement("button");
  lockBtn.type = "button";
  lockBtn.className = "lock-button";
  const isLocked = currentPalette[index].locked;
  lockBtn.textContent = isLocked ? "🔒" : "🔓";
  lockBtn.setAttribute("aria-pressed", String(isLocked));
  lockBtn.setAttribute(
    "aria-label",
    isLocked ? "Desbloquear color" : "Bloquear color para que no cambie",
  );
  lockBtn.addEventListener("click", () => {
    currentPalette[index].locked = !currentPalette[index].locked;
    renderPalette();
  });
  return lockBtn;
}

// ==========================
// Generar / renderizar paleta principal
// ==========================
function formatColorLabel(color: string, type: ColorFormat): string {
  if (type !== "hsl") return color;
  const [model, values] = color.split("(");
  return `${model}<br>(${values}`;
}

function renderPalette(): void {
  paletteContainer.innerHTML = "";
  const type = colorTypeSelect.value as ColorFormat;

  currentPalette.forEach((paletteColor, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = paletteColor.locked ? "color-wrapper locked" : "color-wrapper";

    const swatchArea = document.createElement("div");
    swatchArea.className = "color-swatch-area";

    const box = createColorSwatch(paletteColor.value, "color-box");
    const lockBtn = createLockButton(index);

    swatchArea.appendChild(box);
    swatchArea.appendChild(lockBtn);

    const text = document.createElement("span");
    text.className = "color-text";
    text.innerHTML = formatColorLabel(paletteColor.value, type);

    wrapper.appendChild(swatchArea);
    wrapper.appendChild(text);
    paletteContainer.appendChild(wrapper);
  });
}

function generatePalette(): void {
  const count = parseInt(colorCountSelect.value, 10);
  const type = colorTypeSelect.value as ColorFormat;
  const mode = harmonyModeSelect.value as HarmonyMode;

  const freshColors = generatePaletteColors(mode, count, type);

  const nextPalette: PaletteColor[] = [];
  for (let i = 0; i < count; i++) {
    const existing = currentPalette[i];
    nextPalette.push(existing?.locked ? existing : freshColors[i]);
  }

  currentPalette = nextPalette;
  renderPalette();

  const hues = currentPalette.map((c) => c.hue);
  paletteNameEl.textContent = `✦ ${generatePaletteName(hues)}`;
}

generateBtn.addEventListener("click", generatePalette);

harmonyModeSelect.addEventListener("change", () => {
  const mode = harmonyModeSelect.value as HarmonyMode;
  harmonyDescription.textContent = HARMONY_DESCRIPTIONS[mode];
});

// ==========================
// Guardar paleta actual
// ==========================
function buildSavedPaletteGroup(colors: string[], paletteKey: string): HTMLElement {
  const group = document.createElement("div");
  group.className = "saved-group";

  colors.forEach((color) => {
    group.appendChild(createColorSwatch(color, "mini-swatch"));
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "×";
  deleteBtn.className = "delete-palette";
  deleteBtn.setAttribute("aria-label", "Eliminar esta paleta guardada");
  deleteBtn.addEventListener("click", () => {
    savedContainer.removeChild(group);
    const index = savedPalettesData.indexOf(paletteKey);
    if (index > -1) savedPalettesData.splice(index, 1);
  });
  group.appendChild(deleteBtn);

  return group;
}

saveButton.addEventListener("click", () => {
  if (currentPalette.length === 0) return;

  const colors = currentPalette.map((c) => c.value);
  const paletteKey = colors.join(",");
  if (savedPalettesData.includes(paletteKey)) {
    showTooltip("Esta paleta ya está guardada");
    return;
  }

  savedPalettesData.push(paletteKey);
  savedContainer.appendChild(buildSavedPaletteGroup(colors, paletteKey));
  showTooltip("Paleta guardada ✨");
});

// ==========================
// Limpiar todas las paletas guardadas
// ==========================
clearButton.addEventListener("click", () => {
  savedContainer.innerHTML = "";
  savedPalettesData.length = 0;
});