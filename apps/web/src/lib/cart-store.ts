export interface CartLine {
  productId: string;
  slug: string;
  nameFa: string;
  nameEn: string;
  unitFa: string;
  unitEn: string;
  price: number;
  image: string | null;
  quantity: number;
}

const CART_KEY = "rosevarzan_cart";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let cachedRaw: string | null = null;
let cachedLines: CartLine[] = [];

export function getLines(): CartLine[] {
  if (typeof window === "undefined") return cachedLines;
  const raw = window.localStorage.getItem(CART_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedLines = raw ? (JSON.parse(raw) as CartLine[]) : [];
    } catch {
      cachedLines = [];
    }
  }
  return cachedLines;
}

function saveLines(lines: CartLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
  notify();
}

export function addLine(product: Omit<CartLine, "quantity">, quantity: number) {
  const lines = getLines();
  const existing = lines.find((line) => line.productId === product.productId);
  if (existing) {
    saveLines(lines.map((line) => (line.productId === product.productId ? { ...line, quantity: line.quantity + quantity } : line)));
    return;
  }
  saveLines([...lines, { ...product, quantity }]);
}

export function setLineQuantity(productId: string, quantity: number) {
  if (quantity <= 0) {
    removeLine(productId);
    return;
  }
  saveLines(getLines().map((line) => (line.productId === productId ? { ...line, quantity } : line)));
}

export function removeLine(productId: string) {
  saveLines(getLines().filter((line) => line.productId !== productId));
}

export function clearCart() {
  saveLines([]);
}
