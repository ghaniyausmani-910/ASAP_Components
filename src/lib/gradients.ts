// Caladan navy family — all stops drawn from the ink / ocean anchors.
export const GRADIENT_BG: Record<string, string> = {
  navy: 'bg-[linear-gradient(135deg,#0d2b44_0%,#16436e_100%)]',
  accent: 'bg-[linear-gradient(135deg,#0f4c81_0%,#0d2b44_100%)]',
  steel: 'bg-[linear-gradient(135deg,#16436e_0%,#0b1f33_100%)]',
  sky: 'bg-[linear-gradient(135deg,#0f4c81_0%,#0b1f33_100%)]',
  ink: 'bg-[linear-gradient(135deg,#0d2b44_0%,#0b1f33_100%)]',
  slate: 'bg-[linear-gradient(135deg,#1c3a5a_0%,#0d2b44_100%)]',
}

export function gradient(key: string): string {
  return GRADIENT_BG[key] ?? GRADIENT_BG.navy
}
