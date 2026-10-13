import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { ArrowDown, ArrowUpRight, ChevronUp, MoveDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProvinceShapes } from '../../services/provinces.api';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { scrollImmediately } from '../../lib/lenis';
import { approach } from '../../data/presentation';
import { at, backdrop, cards, chapterAt, chapters, clamp, equipment, equipmentAt, hero, milestones, mix, opening, openingFrame, openingSmokeAt, openingTime, screens, seg, steps, stripWidth, deckLane } from './filmTimeline';
import { useFilm, useFilmScroll } from './useFilm';
import TransitionSmoke from './TransitionSmoke';
import './film.css';

const FilmCanvas = lazy(() => import('./FilmCanvas'));
class CanvasBoundary extends Component<PropsWithChildren<{ onFailure: () => void }>, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

const media = { opening: '/media/parcours/ouverture', port: '/media/parcours/port-grues', deck: '/media/parcours/navire-pont', sea: '/media/parcours/navire-mer' };
// Tracé schématique depuis le nord, jusqu'à l'embouchure : ni port, ni durée, ni itinéraire réel.
const route = 'M-300 -180C-260 60-60 360 76 374';
const ghosts = [
  { word: 'Collecter', from: 1, to: 3, tone: 'light' },
  { word: 'Préparer', from: 3, to: 4.6, tone: 'light' },
  { word: 'Acheminer', from: 6, to: 7.97, tone: 'dark' },
] as const;
const credits = <>
  Images d’illustration : elles ne montrent pas des actions de LabCongo · Ouverture : vidéos de RDNE Stock project (Pexels) · Fumée : <a href="https://www.pexels.com/video/dark-pattern-texture-abstract-4490626/" target="_blank" rel="noreferrer">Engin Akyurt (Pexels)</a> · Navire : vidéos de bellergy (Pixabay) et Alexander Bobrov (Pexels) · Camion : « <a href="https://sketchfab.com/3d-models/scania-truck-59889032d0ad457c81d7e058c79eedf8" target="_blank" rel="noreferrer">Scania truck</a> » de PAndras, <a href="https://creativecommons.org/licenses/by/4.0/deed.fr" target="_blank" rel="noreferrer">CC BY 4.0</a>, allégé et sans logo · Carte : geoBoundaries, © OpenStreetMap (ODbL)
</>;

// Message d'accueil : qui est LabCongo, ce qu'elle fait, et les deux actions principales.
function HeroCopy() {
  return <>
    <p className="film-kicker">LabCongo · ASBL créée à Kinshasa</p>
    <h1><span>Le savoir mérite</span> <em>un autre horizon.</em></h1>
    <p className="film-hero-text">{approach.title}.</p>
    <div className="film-hero-actions">
      <a href="#decouvrir" className="film-hero-primary">Découvrir le projet <ArrowDown size={18} aria-hidden="true" /></a>
      <a href="#agir" className="film-hero-secondary">Soutenir LabCongo <ArrowUpRight size={18} aria-hidden="true" /></a>
    </div>
  </>;
}

// Même hiérarchie que le hero : texte courant, puis une expression mise en couleur.
function ChapterTitle({ card }: { card: (typeof cards)[number] }) {
  return <h2>{card.title.slice(0, -card.accent.length)}<em>{card.accent}</em></h2>;
}

function StaticFilm({ onAnimate }: { onAnimate?: () => void }) {
  const images: Record<string, [string, string]> = {
    recolte: [media.opening, 'un enfant, lunettes de protection et gants, fait une expérience de chimie.'],
    route: [media.port, 'un navire à quai sous les grues d’un port à conteneurs, vu du ciel.'],
    navire: [media.deck, 'le pont d’un porte-conteneurs vu du ciel.'],
    ocean: [media.sea, 'un porte-conteneurs en pleine mer.'],
  };
  return <section className="film-simple" aria-label="Le voyage du matériel scientifique, de l’Europe à la RDC">
    <header className="film-simple-hero">
      <img className="film-simple-hero-image" src={`${media.opening}.jpg`} alt="Image d’illustration : un enfant réalise une expérience de chimie avec des lunettes de protection." width="1920" height="1080" fetchPriority="high" />
      <div className="film-simple-hero-copy"><HeroCopy /></div>
      <p className="film-simple-hero-credit">Image d’illustration · RDNE Stock project / Pexels</p>
    </header>
    <div className="film-simple-tools">
      <p>Le voyage du matériel · Europe → RDC</p>
      {onAnimate && <button type="button" onClick={onAnimate}>Activer la scène au défilement</button>}
    </div>
    {cards.map((card, i) => <article key={card.id} className="film-simple-chapter">
      {images[card.id] ? <img src={`${images[card.id][0]}.jpg`} alt={`Image d’illustration : ${images[card.id][1]}`} loading={i === 0 ? 'eager' : 'lazy'} width="1600" height="900" /> : <div aria-hidden="true" />}
      <div><p className="film-kicker">{card.kicker}</p><ChapterTitle card={card} />{card.text && <p className="film-text">{card.text}</p>}</div>
    </article>)}
    <p className="film-simple-note">{credits}</p>
  </section>;
}

export default function FilmSequence() {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const openingVideo = useRef<HTMLVideoElement>(null);
  const deck = useRef<HTMLVideoElement>(null);
  const sea = useRef<HTMLVideoElement>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const shortScreen = useMediaQuery('(max-height: 500px) and (max-width: 950px)');
  // Les vidéos existent en 1080p pour les grands écrans et en 900p, plus légères, pour les téléphones.
  const videoSize = useMediaQuery('(max-width: 999px)') ? '-900' : '';
  const [supported] = useState(() => {
    try {
      const context = document.createElement('canvas').getContext('webgl2');
      const available = Boolean(context);
      context?.getExtension('WEBGL_lose_context')?.loseContext();
      return available;
    } catch { return false; }
  });
  const [simple, setSimple] = useState(false);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  // Sur téléphone, la liste des chapitres s'ouvre depuis une ligne compacte.
  const [menu, setMenu] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setFailed(true), []);
  const possible = supported && !reduced && !shortScreen && !failed;
  const live = possible && !simple;
  const active = useFilm((state) => chapterAt(at(state.progress)));
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
    enabled: ready,
    staleTime: Infinity,
    retry: 1,
  });

  useEffect(() => {
    if (!live || !near || !stage.current) return;
    const element = stage.current;
    const videos = [openingVideo.current, deck.current, sea.current];
    const targets = [0, 0, 0];
    // Les vidéos suivent le défilement image par image, dans les deux sens.
    const seek = () => videos.forEach((video, i) => {
      if (video && video.readyState > 0 && !video.seeking && Math.abs(video.currentTime - targets[i]) > .03) video.currentTime = targets[i];
    });
    const paint = () => {
      const p = useFilm.getState().progress;
      const x = at(p);
      const aspect = element.clientWidth / Math.max(1, element.clientHeight);
      const set = (name: string, value: number | string) => element.style.setProperty(name, String(value));
      element.style.backgroundColor = `rgb(${backdrop(x)})`;
      set('--film-progress', p);
      // La fumée et les deux masques avancent ensemble : vidéo devant, objets derrière.
      const reveal = seg(x, ...opening.reveal);
      const smoke = openingSmokeAt(x, aspect);
      const behind = (smoke.edge - smoke.feather) * 100;
      const ahead = (smoke.edge + smoke.feather) * 100;
      set('--opening-opacity', smoke.time < 1 ? 1 : 0);
      set('--opening-wipe', `linear-gradient(90deg, transparent ${behind}%, #000 ${ahead}%)`);
      set('--objects-wipe', `linear-gradient(90deg, #000 ${behind}%, transparent ${ahead}%)`);
      set('--opening-mask', mix(1, .6, reveal));
      // Sur téléphone, le voile du haut n'arrive qu'avec le premier chapitre : le message d'accueil est en bas, sous le visage.
      set('--mobile-shade-opacity', seg(x, hero.to - .14, hero.to + .06) * (1 - .6 * reveal * (1 - seg(x, 1.1, 1.25))) * (1 - seg(x, 4.55, 4.8)));
      const intro = element.querySelector<HTMLElement>('.film-hero');
      if (intro) {
        const shown = clamp((hero.to - x) / .2);
        intro.style.opacity = String(shown);
        intro.style.transform = `translateY(${(shown - 1) * 16}px)`;
        intro.inert = shown < .05;
      }
      element.toggleAttribute('data-intro', x < hero.cue);
      if (openingVideo.current) {
        const frame = openingFrame(element.clientWidth, element.clientHeight, x, useFilm.getState().controls);
        Object.assign(openingVideo.current.style, { width: `${frame.w}px`, height: `${frame.h}px`, left: `${frame.left}px`, top: `${frame.top}px` });
      }
      set('--canvas-opacity', 1 - seg(x, 8.87, 9.22));
      element.querySelectorAll<HTMLElement>('.film-ghost').forEach((ghost, i) => {
        const { from, to } = ghosts[i];
        ghost.style.opacity = String(seg(x, from, from + .4) * (1 - seg(x, to - .4, to)));
        ghost.style.transform = `translateX(${mix(10, -40, seg(x, from, to))}%)`;
      });
      set('--equipment-opacity', seg(x, 1, 1.3) * (1 - seg(x, 2.8, 3.05)));
      element.querySelectorAll<HTMLElement>('.film-equipment li').forEach((item, i) => item.classList.toggle('is-active', i === equipmentAt(x)));
      set('--steps-opacity', seg(x, 3.2, 3.5) * (1 - seg(x, 4.4, 4.65)));
      element.querySelectorAll<HTMLElement>('.film-steps li').forEach((item, i) => item.classList.toggle('is-active', i <= Math.floor(seg(x, 3.3, 4.5) * 3.999)));
      set('--band-shift', `${mix(0, -55, seg(x, 6.8, 7.75))}%`);
      set('--band-opacity', seg(x, 6.6, 7.16) * (1 - seg(x, 7.64, 7.86)));
      // Vue du ciel, la route s'ouvre sur le pont du navire : d'abord dans son couloir, puis plein écran.
      const open = seg(x, 8.77, 9.12), half = stripWidth(aspect) * 50;
      set('--reveal-clip', `inset(${mix(100, 0, seg(x, 8.52, 8.77))}% ${mix(100 - deckLane * 100 - half, 0, open)}% 0 ${mix(deckLane * 100 - half, 0, open)}%)`);
      set('--sea-opacity', seg(x, 10.12, 10.72));
      set('--sea-scale', mix(1.18, 1, seg(x, 10.12, 11.92)));
      set('--shade-opacity', seg(x, 10.32, 10.92) * .3 + seg(x, 11.62, 12.22) * .45);
      set('--tint-opacity', seg(x, 8.77, 9.02) * .42 - seg(x, 10.32, 10.92) * .27 + seg(x, 11.62, 12.22) * .4);
      set('--map-opacity', seg(x, 11.62, 12.12));
      set('--map-scale', mix(.62, 1, seg(x, 11.62, 12.92)));
      set('--route-draw', 1 - seg(x, 11.72, 12.52));
      targets[0] = openingTime(x);
      targets[1] = 13.5 * seg(x, 8.52, 10.52);
      targets[2] = 19.5 * seg(x, 10.12, 12.22);
      seek();
      element.querySelectorAll<HTMLElement>('.film-card').forEach((card, i) => {
        const { from, to } = cards[i];
        const visible = clamp(Math.min((x - from) / .2, (to - x) / .2));
        card.style.opacity = String(visible);
        card.style.transform = `translateY(${(1 - visible) * 16}px)`;
        card.setAttribute('aria-hidden', String(visible < .05));
        card.inert = visible < .05;
      });
    };
    // La vidéo d'ouverture se cale au-dessus des commandes : leur position est mesurée à chaque redimensionnement.
    const footer = element.querySelector<HTMLElement>('.film-footer');
    const measure = () => useFilm.getState().setControls(footer ? footer.offsetTop / Math.max(1, element.clientHeight) : 1);
    measure();
    paint();
    videos.forEach((video) => video?.addEventListener('seeked', seek));
    window.addEventListener('resize', measure);
    window.addEventListener('resize', paint);
    const unsubscribe = useFilm.subscribe(paint);
    return () => {
      unsubscribe();
      window.removeEventListener('resize', measure);
      window.removeEventListener('resize', paint);
      videos.forEach((video) => video?.removeEventListener('seeked', seek));
    };
  }, [live, near, ready]);

  const seekChapter = (index: number) => {
    const element = track.current;
    const stageHeight = stage.current?.offsetHeight ?? window.innerHeight;
    if (!element) return;
    // Atteindre le texte pleinement visible, après son fondu d’entrée ; le premier chapitre ramène au message d'accueil.
    const destination = index === 0 ? 0 : Math.max(chapters[index].start, cards[index].from + .2);
    scrollImmediately(window.scrollY + element.getBoundingClientRect().top + destination / screens * (element.offsetHeight - stageHeight));
    setMenu(false);
  };
  const changeMode = () => {
    setSimple((value) => !value);
    requestAnimationFrame(() => document.getElementById('le-voyage')?.scrollIntoView());
  };

  if (!live) return <div id="le-voyage"><StaticFilm onAnimate={possible ? changeMode : undefined} /></div>;
  return <section id="le-voyage" ref={track} className="film" style={{ height: `${(screens + 1) * 100}svh` }} aria-label="Le voyage du matériel scientifique, de l’Europe à la RDC">
    <div ref={stage} className="film-stage" data-intro="">
      <div className="film-progress" aria-hidden="true" />
      <div className="film-video film-opening" aria-hidden="true">
        {near && <video ref={openingVideo} src={`${media.opening}${videoSize}.mp4`} poster={`${media.opening}.jpg`} muted playsInline preload="auto" />}
      </div>
      {ghosts.map((ghost) => <p key={ghost.word} className={`film-ghost is-${ghost.tone}`} aria-hidden="true">{ghost.word}</p>)}
      <div className="film-canvas" aria-hidden="true">
        {near && <CanvasBoundary onFailure={onFailure}><Suspense fallback={null}><FilmCanvas onReady={onReady} onFailure={onFailure} /></Suspense></CanvasBoundary>}
      </div>
      {near && <TransitionSmoke />}
      {near && !ready && <p className="film-loading" role="status">Le matériel se prépare…</p>}
      <ol className="film-equipment" aria-hidden="true">
        {equipment.map((item, i) => <li key={item}><span>0{i + 1}</span>{item}</li>)}
      </ol>
      <ol className="film-steps" aria-hidden="true">
        {steps.map((step, i) => <li key={step}><span>0{i + 1}</span>{step}</li>)}
      </ol>
      <ol className="film-band" aria-hidden="true">
        {milestones.map((milestone, i) => <li key={milestone}><span>0{i + 1}</span>{milestone}</li>)}
      </ol>
      {/* Les vidéos du navire ne servent qu'à mi-parcours : elles se chargent une fois la scène prête. */}
      <div className="film-video film-deck" aria-hidden="true">
        {ready && <video ref={deck} src={`${media.deck}${videoSize}.mp4`} poster={`${media.deck}.jpg`} muted playsInline preload="auto" />}
      </div>
      <div className="film-video film-sea" aria-hidden="true">
        {ready && <video ref={sea} src={`${media.sea}${videoSize}.mp4`} poster={`${media.sea}.jpg`} muted playsInline preload="auto" />}
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
      <div className="film-hero"><HeroCopy /></div>
      <div className="film-cards">
        {cards.map((card) => {
          return <div key={card.id} className={`film-card is-${card.place} is-${card.tone}${card.title.length > 40 ? ' is-long' : ''}`} aria-hidden="true">
            <p className="film-kicker">{card.kicker}</p>
            <ChapterTitle card={card} />
            {card.text && <p className="film-text">{card.text}</p>}
            {card.id === 'arrivee' && <a href="#decouvrir" className="film-link">Découvrir le projet <ArrowUpRight size={18} aria-hidden="true" /></a>}
          </div>;
        })}
      </div>
      <div className="film-footer">
        <div className="film-bottom">
          <a href="#decouvrir" className="film-skip" aria-label="Passer le film"><MoveDown size={18} aria-hidden="true" /><span>Passer le film</span></a>
          <p className="film-scroll-cue" aria-hidden="true"><MoveDown size={16} />Faites défiler</p>
          <button type="button" className="film-chapters-toggle" aria-expanded={menu} aria-controls="film-chapters" onClick={() => setMenu((open) => !open)}>
            <span>0{active + 1} / 0{chapters.length}</span>{chapters[active].label}<ChevronUp size={16} aria-hidden="true" />
          </button>
          <nav id="film-chapters" className={`film-chapters${menu ? ' is-open' : ''}`} aria-label="Étapes du voyage">
            {chapters.map((chapter, i) => <button key={chapter.label} type="button" aria-label={`Étape ${i + 1} : ${chapter.label}`} aria-current={i === active ? 'step' : undefined} onClick={() => seekChapter(i)}>
              <span>0{i + 1}</span><span className="film-chapter-label">{chapter.label}</span>
            </button>)}
          </nav>
          <button type="button" className="film-mode" onClick={changeMode}>Lecture simple</button>
        </div>
        <details className="film-credits">
          <summary>Images d’illustration · Crédits</summary>
          <p data-lenis-prevent>{credits}</p>
        </details>
      </div>
    </div>
  </section>;
}
