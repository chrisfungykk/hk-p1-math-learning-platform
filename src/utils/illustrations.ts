/**
 * Small inline SVG illustrations for exam questions.
 * Each returns a raw SVG string (~100×80 viewBox).
 */

/** Analog clock face showing given hour and minute. */
export function clockSvg(hour: number, minute: number): string {
  const cx = 50, cy = 44, r = 34;
  const hAngle = ((hour % 12) * 30 + minute * 0.5 - 90) * Math.PI / 180;
  const hx = cx + 18 * Math.cos(hAngle);
  const hy = cy + 18 * Math.sin(hAngle);
  const mAngle = (minute * 6 - 90) * Math.PI / 180;
  const mx = cx + 28 * Math.cos(mAngle);
  const my = cy + 28 * Math.sin(mAngle);
  const markers = Array.from({ length: 12 }, (_, i) => {
    const a = ((i + 1) * 30 - 90) * Math.PI / 180;
    const tx = cx + 26 * Math.cos(a);
    const ty = cy + 26 * Math.sin(a) + 3;
    return `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" font-size="7" fill="#4A148C" font-family="sans-serif">${i + 1}</text>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 88" width="100" height="88">
<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFF" stroke="#7B1FA2" stroke-width="3"/>
${markers}
<line x1="${cx}" y1="${cy}" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="#4A148C" stroke-width="3" stroke-linecap="round"/>
<line x1="${cx}" y1="${cy}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="#7B1FA2" stroke-width="2" stroke-linecap="round"/>
<circle cx="${cx}" cy="${cy}" r="2.5" fill="#4A148C"/>
</svg>`;
}

/** Colored bar showing two lengths for comparison. */
export function lengthBarsSvg(aLen: number, bLen: number, aLabel: string, bLabel: string): string {
  const maxPx = 85;
  const maxVal = Math.max(aLen, bLen);
  const aw = Math.round((aLen / maxVal) * maxPx);
  const bw = Math.round((bLen / maxVal) * maxPx);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" width="100" height="60">
<rect x="8" y="8" width="${aw}" height="14" rx="3" fill="#42A5F5"/>
<text x="${aw + 12}" y="19" font-size="8" fill="#1565C0" font-family="sans-serif">${aLabel}</text>
<rect x="8" y="34" width="${bw}" height="14" rx="3" fill="#EF5350"/>
<text x="${bw + 12}" y="45" font-size="8" fill="#C62828" font-family="sans-serif">${bLabel}</text>
</svg>`;
}

/** Row of colored circles representing counted objects. */
export function countDotsSvg(count: number, color?: string): string {
  const fill = color || '#EF5350';
  const cols = Math.min(count, 10);
  const rows = Math.ceil(count / 10);
  const w = cols * 12 + 6;
  const h = rows * 14 + 4;
  const dots = Array.from({ length: count }, (_, i) => {
    const col = i % 10;
    const row = Math.floor(i / 10);
    return `<circle cx="${col * 12 + 9}" cy="${row * 14 + 9}" r="5" fill="${fill}"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${dots}</svg>`;
}

/** Simple 2D shape outline. */
export function shapeSvg(shapeName: string): string {
  const shapes: Record<string, string> = {
    '圓形': '<circle cx="30" cy="30" r="24" fill="#FFCDD2" stroke="#E53935" stroke-width="2"/>',
    '三角形': '<polygon points="30,6 6,54 54,54" fill="#C8E6C9" stroke="#2E7D32" stroke-width="2"/>',
    '正方形': '<rect x="6" y="6" width="48" height="48" fill="#BBDEFB" stroke="#1565C0" stroke-width="2"/>',
    '長方形': '<rect x="2" y="12" width="56" height="36" fill="#FFF9C4" stroke="#F9A825" stroke-width="2"/>',
    '菱形': '<polygon points="30,6 54,30 30,54 6,30" fill="#E1BEE7" stroke="#7B1FA2" stroke-width="2"/>',
    '五邊形': '<polygon points="30,6 54,22 46,52 14,52 6,22" fill="#B2EBF2" stroke="#00838F" stroke-width="2"/>',
    '六邊形': '<polygon points="15,6 45,6 58,30 45,54 15,54 2,30" fill="#DCEDC8" stroke="#558B2F" stroke-width="2"/>',
    '正方體': '<rect x="10" y="18" width="30" height="30" fill="#A5D6A7" stroke="#2E7D32" stroke-width="2"/><polygon points="10,18 22,8 52,8 40,18" fill="#C8E6C9" stroke="#2E7D32" stroke-width="1.5"/><polygon points="40,18 52,8 52,38 40,48" fill="#81C784" stroke="#2E7D32" stroke-width="1.5"/>',
    '圓柱體': '<rect x="12" y="20" width="36" height="28" fill="#90CAF9" stroke="#1565C0" stroke-width="2"/><ellipse cx="30" cy="20" rx="18" ry="8" fill="#BBDEFB" stroke="#1565C0" stroke-width="2"/><ellipse cx="30" cy="48" rx="18" ry="8" fill="none" stroke="#1565C0" stroke-width="2"/>',
    '球體': '<circle cx="30" cy="30" r="24" fill="#EF9A9A" stroke="#E53935" stroke-width="2"/><ellipse cx="30" cy="30" rx="24" ry="8" fill="none" stroke="#C62828" stroke-width="1" stroke-dasharray="3,2"/><ellipse cx="22" cy="22" rx="6" ry="4" fill="#FFF" opacity="0.4"/>',
    '圓錐體': '<polygon points="30,6 10,54 50,54" fill="#FFF59D" stroke="#F9A825" stroke-width="2"/><ellipse cx="30" cy="54" rx="20" ry="6" fill="#FFF9C4" stroke="#F9A825" stroke-width="2"/>',
  };
  const inner = shapes[shapeName] || shapes['圓形'];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">${inner}</svg>`;
}

/** HK coin illustration. */
export function coinSvg(value: number): string {
  const isNote = value >= 20;
  if (isNote) {
    const colors: Record<number, string> = { 20: '#81D4FA', 50: '#CE93D8', 100: '#EF9A9A', 500: '#A5D6A7' };
    const fill = colors[value] || '#FFE082';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36" width="60" height="36">
<rect x="2" y="2" width="56" height="32" rx="4" fill="${fill}" stroke="#666" stroke-width="1.5"/>
<text x="30" y="23" text-anchor="middle" font-size="14" font-weight="bold" fill="#333" font-family="sans-serif">$${value}</text>
</svg>`;
  }
  const isGold = value >= 0.5;
  const fill = isGold ? '#FFD54F' : '#E0E0E0';
  const stroke = isGold ? '#F57F17' : '#757575';
  const r = value >= 5 ? 18 : value >= 1 ? 16 : 14;
  const sz = r * 2 + 6;
  const c = sz / 2;
  const label = value >= 1 ? `$${value}` : `${value * 10}¢`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}">
<circle cx="${c}" cy="${c}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
<text x="${c}" y="${c + 4}" text-anchor="middle" font-size="10" font-weight="bold" fill="#333" font-family="sans-serif">${label}</text>
</svg>`;
}

/** Simple bar chart for data handling questions. */
export function barChartSvg(data: { label: string; value: number }[]): string {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barW = 16;
  const gap = 8;
  const chartH = 50;
  const w = data.length * (barW + gap) + gap + 10;
  const colors = ['#EF5350', '#FDD835', '#42A5F5', '#66BB6A', '#AB47BC', '#FF7043'];
  const bars = data.map((d, i) => {
    const bh = Math.round((d.value / maxVal) * chartH);
    const x = gap + i * (barW + gap) + 5;
    const y = chartH + 4 - bh;
    const fill = colors[i % colors.length];
    return `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="2" fill="${fill}" opacity="0.85"/>
<text x="${x + barW / 2}" y="${chartH + 16}" text-anchor="middle" font-size="7" fill="#333" font-family="sans-serif">${d.label}</text>
<text x="${x + barW / 2}" y="${y - 2}" text-anchor="middle" font-size="7" font-weight="bold" fill="${fill}" font-family="sans-serif">${d.value}</text>`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${chartH + 22}" width="${w}" height="${chartH + 22}">
<line x1="4" y1="4" x2="4" y2="${chartH + 4}" stroke="#999" stroke-width="1"/>
<line x1="4" y1="${chartH + 4}" x2="${w - 2}" y2="${chartH + 4}" stroke="#999" stroke-width="1"/>
${bars}
</svg>`;
}

/** Ten-frame (5×2 grid) showing filled and empty dots. */
export function tenFrameSvg(filled: number, total?: number): string {
  const t = total || 10;
  const cols = 5;
  const rows = Math.ceil(t / cols);
  const w = cols * 18 + 8;
  const h = rows * 18 + 8;
  const cells = Array.from({ length: t }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * 18 + 6;
    const y = row * 18 + 6;
    const isFilled = i < filled;
    return `<rect x="${x}" y="${y}" width="16" height="16" rx="3" fill="${isFilled ? '#42A5F5' : '#F5F5F5'}" stroke="#90CAF9" stroke-width="1"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${cells}</svg>`;
}
