import { lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from '../../lib/gsap';
const DetailedHome = lazy(() => import('./DetailedHome'));

export default function HomeDetails() {
  const { hash } = useLocation();
  const needsDetails = Boolean(hash && !['#main', '#decouvrir', '#agir', '#presentation', '#enjeux', '#mission', '#approche', '#impact'].includes(hash) && !hash.startsWith('#recit-'));
  const [state, setState] = useState({ hash, open: needsDetails });
  if (state.hash !== hash) setState({ hash, open: needsDetails || state.open });
  const open = state.open;
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [open]);
  return <details className="home-details" open={open} onToggle={(event) => setState({ hash, open: event.currentTarget.open })}>
    <summary className="container">Le projet en détail<span>La collecte, le voyage du matériel, la carte, les écoles et le suivi des actions</span></summary>
    {open && <Suspense fallback={<p className="container home-details-loading" role="status">Chargement du projet…</p>}><DetailedHome /></Suspense>}
  </details>;
}
