import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProvinceShapes } from '../../services/provinces.api';
import { between, clamp, mix } from '../immersive/timeline';
import { cards, milestones, stripWidth } from './filmTimeline';
import { useFilm, useFilmScroll } from './useFilm';
import './film.css';

const FilmCanvas = lazy(() => import('./FilmCanvas'));
class CanvasBoundary extends Component<PropsWithChildren<{ onFailure: () => void }>, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

const media = { port: '/media/parcours/port-grues', deck: '/media/parcours/navire-pont', sea: '/media/parcours/navire-mer' };
// Tracé schématique depuis le nord, jusqu'à l'embouchure : ni port, ni durée, ni itinéraire réel.
const route = 'M-300 -180C-260 60-60 360 76 374';
const credits = <>
  Images d’illustration : elles ne montrent pas des actions de LabCongo · Vidéos : K et Alexander Bobrov (Pexels) · Camion : « <a href="https://sketchfab.com/3d-models/scania-truck-59889032d0ad457c81d7e058c79eedf8" target="_blank" rel="noreferrer">Scania truck</a> » de PAndras, <a href="https://creativecommons.org/licenses/by/4.0/deed.fr" target="_blank" rel="noreferrer">CC BY 4.0</a>, allégé et sans logo · Carte : geoBoundaries, © OpenStreetMap (ODbL)
</>;

// Les lettres se décodent avant de se fixer, comme dans la référence.
function scramble(element: HTMLElement, text: string) {
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

function StaticFilm() {
  const images: Record<string, [string, string]> = {
    route: [media.port, 'Vue aérienne d’un navire à quai sous les grues d’un port à conteneurs.'],
    navire: [media.deck, 'Le pont d’un porte-conteneurs vu du ciel.'],
    ocean: [media.sea, 'Un porte-conteneurs en pleine mer.'],
  };
  return <section className="film-simple" aria-label="Le voyage du conteneur, de l’Europe à la RDC">
    {cards.map((card) => <article key={card.id} className="film-simple-chapter">
      {images[card.id] && <img src={`${images[card.id][0]}.jpg`} alt={`Image d’illustration : ${images[card.id][1]}`} loading="lazy" width="1600" height="900" />}
      <div><p className="film-kicker">{card.kicker}</p><h2>{card.title}</h2>{card.text && <p>{card.text}</p>}</div>
    </article>)}
    <p className="film-simple-note">{credits}</p>
  </section>;
}

export default function FilmSequence({ animated }: { animated: boolean }) {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLVideoElement>(null);
  const sea = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setFailed(true), []);
  const live = animated && !failed;
  useFilmScroll(track, live);

  // Modèles, vidéos et carte ne se téléchargent qu'à l'approche de la séquence.
  useEffect(() => {
    const element = track.current;
    if (!live || !element) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setNear(true);
        observer.disconnect();
      }
    }, { rootMargin: '300% 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, [live]);

  const { data: provinces } = useQuery({
    queryKey: ['province-shapes'],
    queryFn: ({ signal }) => getProvinceShapes(signal),
    enabled: near,
    staleTime: Infinity,
    retry: 1,
  });

  useEffect(() => {
    if (!live || !near || !stage.current) return;
    const element = stage.current;
    const videos = [deck.current, sea.current];
    const targets = [0, 0];
    // Les vidéos suivent le défilement image par image, dans les deux sens.
    const seek = () => videos.forEach((video, i) => {
      if (video && video.readyState > 0 && !video.seeking && Math.abs(video.currentTime - targets[i]) > .03) video.currentTime = targets[i];
    });
    const scrambles = new Map<string, () => void>();
    const paint = () => {
      const p = useFilm.getState().progress;
      const aspect = element.clientWidth / Math.max(1, element.clientHeight);
      const set = (name: string, value: number | string) => element.style.setProperty(name, String(value));
      set('--film-progress', p);
      set('--ghost-shift', `${mix(8, -46, between(p, 0, .4))}%`);
      set('--ghost-opacity', 1 - between(p, .3, .4));
      set('--band-shift', `${mix(0, -55, between(p, .1, .36))}%`);
      set('--band-opacity', between(p, .06, .12) * (1 - between(p, .32, .38)));
      set('--canvas-opacity', 1 - between(p, .57, .63));
      // Vue du ciel, la route s'ouvre sur le pont du navire : d'abord dans le couloir, puis plein écran.
      const side = mix(50 - stripWidth(aspect) * 50, 0, between(p, .55, .62));
      set('--reveal-clip', `inset(${mix(100, 0, between(p, .5, .55))}% ${side}% 0 ${side}%)`);
      set('--sea-opacity', between(p, .72, .78));
      set('--sea-scale', mix(1.18, 1, between(p, .72, .9)));
      set('--shade-opacity', between(p, .74, .8) * .3 + between(p, .87, .93) * .45);
      set('--tint-opacity', between(p, .55, .6) * .42 - between(p, .74, .8) * .27 + between(p, .87, .93) * .4);
      set('--map-opacity', between(p, .87, .92));
      set('--map-scale', mix(.62, 1, between(p, .87, 1)));
      set('--route-draw', 1 - between(p, .88, .96));
      targets[0] = 13.5 * between(p, .5, .76);
      targets[1] = 19.5 * between(p, .72, .93);
      seek();
      element.querySelectorAll<HTMLElement>('.film-card').forEach((card, i) => {
        const { id, from, to, title } = cards[i];
        const visible = clamp(Math.min((p - from) / .02, (to - p) / .02));
        card.style.opacity = String(visible);
        card.style.transform = `translateY(${(1 - visible) * 16}px)`;
        card.setAttribute('aria-hidden', String(visible < .05));
        const text = card.querySelector<HTMLElement>('.film-title-text');
        if (visible >= .05 && !scrambles.has(id) && text) scrambles.set(id, scramble(text, title));
        if (visible < .05 && scrambles.has(id)) {
          scrambles.get(id)?.();
          scrambles.delete(id);
        }
      });
    };
    paint();
    videos.forEach((video) => video?.addEventListener('seeked', seek));
    window.addEventListener('resize', paint);
    const unsubscribe = useFilm.subscribe(paint);
    return () => {
      unsubscribe();
      window.removeEventListener('resize', paint);
      videos.forEach((video) => video?.removeEventListener('seeked', seek));
      scrambles.forEach((cancel) => cancel());
    };
  }, [live, near, ready]);

  if (!live) return <StaticFilm />;
  return <section ref={track} className="film" aria-label="Le voyage du conteneur, de l’Europe à la RDC">
    <div ref={stage} className="film-stage">
      <div className="film-progress" aria-hidden="true" />
      <p className="film-ghost" aria-hidden="true">Acheminer</p>
      <div className="film-canvas" aria-hidden="true">
        {near && <CanvasBoundary onFailure={onFailure}><Suspense fallback={null}><FilmCanvas onReady={onReady} onFailure={onFailure} /></Suspense></CanvasBoundary>}
      </div>
      {near && !ready && <p className="film-loading" role="status">Le convoi se prépare…</p>}
      <ol className="film-band" aria-hidden="true">
        {milestones.map((milestone, i) => <li key={milestone}><span>0{i + 1}</span>{milestone}</li>)}
      </ol>
      {/* Les vidéos ne servent qu'à mi-parcours : elles se chargent une fois le convoi prêt. */}
      <div className="film-video film-deck" aria-hidden="true">
        {ready && <video ref={deck} src={`${media.deck}.mp4`} poster={`${media.deck}.jpg`} muted playsInline preload="auto" />}
      </div>
      <div className="film-video film-sea" aria-hidden="true">
        {ready && <video ref={sea} src={`${media.sea}.mp4`} poster={`${media.sea}.jpg`} muted playsInline preload="auto" />}
      </div>
      <div className="film-tint" aria-hidden="true" />
      <div className="film-shade" aria-hidden="true" />
      <div className="film-map" aria-hidden="true">
        <svg viewBox="0 0 720 650">
          <g className="film-provinces">{provinces?.map((shape) => <path key={shape.code} d={shape.path} />)}</g>
          <path className="film-route" d={route} pathLength={1} />
          <circle className="film-arrival" cx="76" cy="374" r="9" />
        </svg>
      </div>
      <div className="film-cards">
        {cards.map((card) => <div key={card.id} className={`film-card is-${card.place} is-${card.tone}${card.id === 'navire' ? ' is-echo' : ''}`} aria-hidden="true">
          <p className="film-kicker">{card.kicker}</p>
          <h2 aria-label={card.title} data-echo={card.title}><span className="film-title-text" aria-hidden="true">{card.title}</span></h2>
          {card.text && <p className="film-text">{card.text}</p>}
        </div>)}
      </div>
      <p className="film-credits">{credits}</p>
    </div>
  </section>;
}
