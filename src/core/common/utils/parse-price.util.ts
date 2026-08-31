/**
 * Normaliza un precio que puede llegar como número o como string con coma
 * o punto como separador decimal. La app se usa en LatAm/España, donde
 * mucha gente escribe "12,50" y otra "12.50" -- ambas formas deben poder
 * publicar un menú / plato / promoción.
 *
 * Casos:
 *   12        -> 12
 *   "12"      -> 12
 *   "12,50"   -> 12.5
 *   "12.50"   -> 12.5
 *   "1.500"   -> 1500     (punto como separador de miles)
 *   "1,500"   -> 1500     (coma como separador de miles)
 *   "1.500,50"-> 1500.5   (formato es-AR)
 *   "1,500.50"-> 1500.5   (formato en-US)
 *   "$ 12,50" -> 12.5     (ignora símbolo de moneda y espacios)
 *
 * Si no se puede interpretar como número devuelve el valor original tal
 * cual, para que @IsNumber() lo rechace con su mensaje habitual.
 */
export function parsePriceValue(value: unknown): unknown {
  if (value === null || value === undefined || value === '') return value;
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return value;

  let s = value.trim().replace(/[^\d.,-]/g, '');
  if (!/\d/.test(s)) return value;

  const negative = s.startsWith('-');
  s = s.replace(/-/g, '');

  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');

  let decimalSep: '' | '.' | ',' = '';

  if (lastComma > -1 && lastDot > -1) {
    // Están los dos: el último es el decimal, el otro es separador de miles.
    decimalSep = lastComma > lastDot ? ',' : '.';
  } else if (lastComma > -1) {
    decimalSep = isThousandsGrouping(s.split(',')) ? '' : ',';
  } else if (lastDot > -1) {
    decimalSep = isThousandsGrouping(s.split('.')) ? '' : '.';
  }

  if (decimalSep === '') {
    s = s.replace(/[.,]/g, '');
  } else {
    const thousandsSep = decimalSep === ',' ? '.' : ',';
    s = s.split(thousandsSep).join('');
    s = s.replace(decimalSep, '.');
  }

  const n = Number(s);
  if (!Number.isFinite(n)) return value;
  return negative ? -n : n;
}

// "1.200" / "1,200,000": primer grupo 1..3 dígitos y el resto exactamente 3.
function isThousandsGrouping(parts: string[]): boolean {
  if (parts.length < 2) return false;
  if (parts[0].length < 1 || parts[0].length > 3) return false;
  return parts.slice(1).every((p) => p.length === 3);
}
