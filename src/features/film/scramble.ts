// Les lettres se décodent avant de se fixer, comme dans la référence.
export function scramble(element: HTMLElement, text: string) {
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const start = performance.now();
  let frame = 0;
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / 700);
    const settled = Math.floor(t * text.length);
    element.textContent = [...text].map((char, i) => i < settled || char === ' ' ? char : glyphs[Math.floor(Math.random() * glyphs.length)]).join('');
    if (t < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  return () => { cancelAnimationFrame(frame); element.textContent = text; };
}
