import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { ArrowDown, ArrowUpRight, ChevronUp, MoveDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProvinceShapes } from '../../services/provinces.api';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { scrollImmediately } from '../../lib/lenis';
import { approach } from '../../data/presentation';
import { at, backdrop, captionRange, captions, captionsEnd, cards, chapterAt, chapters, clamp, collect, exitCovers, exitShot, filmScreens, hero, lab, labFrame, milestones, mix, openingMask, prelude, progressAt, sceneShown, seg, setExitPace, steps, stripWidth, deckLane, travelAt, travelShots, stepStarts } from './filmTimeline';
import { useFilm, useFilmScroll } from './useFilm';
import { MotifField } from '../../components/motifs/LabMotifs';
import './film.css';

const FilmCanvas = lazy(() => import('./FilmCanvas'));
// Délais avant chaque nouvel essai de la scène 3D après un échec, en millisecondes.
const retries = [4000, 10000, 25000, 60000];
class CanvasBoundary extends Component<PropsWithChildren<{ onFailure: () => void }>, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: unknown) {
    console.warn('Film : scène 3D indisponible, le film continue sans elle.', error);
    this.props.onFailure();
  }
  render() { return this.state.failed ? null : this.props.children; }
}

// Laboratoire : photo d'ouverture, même photo paillasse vidée (`-vide`) et salle avec ses caisses (`-caisses`, lecture simple).
const media = { lab: '/media/parcours/labo', port: '/media/parcours/port-grues', deck: '/media/parcours/navire-pont', sea: '/media/parcours/navire-mer' };
// Tracé schématique depuis le nord, jusqu'à l'embouchure : ni port, ni durée, ni itinéraire réel.
const route = 'M-300 -180C-260 60-60 360 76 374';
const ghosts = [
  { word: 'Acheminer', from: 4, to: 5.62, tone: 'dark' },
] as const;
const credits = <>
  Images d’illustration : elles ne montrent pas des actions de LabCongo · Laboratoire : images et vidéo générées · Navire : vidéos de bellergy (Pixabay) et Alexander Bobrov (Pexels) · Camion : « <a href="https://sketchfab.com/3d-models/scania-truck-59889032d0ad457c81d7e058c79eedf8" target="_blank" rel="noreferrer">Scania truck</a> » de PAndras, <a href="https://creativecommons.org/licenses/by/4.0/deed.fr" target="_blank" rel="noreferrer">CC BY 4.0</a>, allégé et sans logo · Carte : geoBoundaries, © OpenStreetMap (ODbL)
</>;

// Message d'accueil : qui est LabCongo, ce qu'elle fait, et les deux actions principales.
function HeroCopy() {
  return <>
    <p className="film-kicker">LabCongo · Initiative éducative basée à Kinshasa</p>
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

// Provinces dessinées une seule fois dans un canevas : pendant que la carte s'agrandit, le navigateur met l'image
// à l'échelle au lieu de redessiner les tracés à chaque image. Même calage que le SVG de la route (720 × 650, centré).
function ProvinceLayer({ shapes }: { shapes?: { code: string; path: string }[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element || !shapes) return;
    const draw = () => {
      const width = element.clientWidth, height = element.clientHeight;
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      const context = element.getContext('2d');
      if (!context) return;
      const scale = Math.min(width / 720, height / 650);
      context.setTransform(ratio * scale, 0, 0, ratio * scale, ratio * (width - 720 * scale) / 2, ratio * (height - 650 * scale) / 2);
      context.fillStyle = '#ffffff14';
      context.strokeStyle = '#ffffffb3';
      context.lineWidth = 1.2;
      context.lineJoin = 'round';
      for (const shape of shapes) {
        const path = new Path2D(shape.path);
        context.fill(path);
        context.stroke(path);
      }
    };
    const observer = new ResizeObserver(draw);
    observer.observe(element);
    return () => observer.disconnect();
  }, [shapes]);
  return <canvas ref={canvas} className="film-provinces" />;
}

function StaticFilm({ onAnimate }: { onAnimate?: () => void }) {
  const images: Record<string, [string, string]> = {
    collecte: [`${media.lab}-caisses`, 'une salle de laboratoire scolaire, avec trois caisses ouvertes dans l’allée.'],
    route: [media.port, 'un navire à quai sous les grues d’un port à conteneurs, vu du ciel.'],
    navire: [media.deck, 'le pont d’un porte-conteneurs vu du ciel.'],
    ocean: [media.sea, 'un porte-conteneurs en pleine mer.'],
  };
  return <section className="film-simple" aria-label="Le voyage du matériel scientifique, de l’Europe à la RDC">
    <header className="film-simple-hero">
      <img className="film-simple-hero-image" src={`${media.lab}.jpg`} alt="Image d’illustration générée : une salle de laboratoire scolaire lumineuse, dont les paillasses portent microscopes et verrerie." width={lab.width} height={lab.height} fetchPriority="high" />
      <div className="film-hero-motif" aria-hidden="true"><div className="motif-texture is-hero" /></div>
      <div className="film-simple-hero-copy"><MotifField set="hero" drift={false} /><HeroCopy /></div>
      <p className="film-simple-hero-credit">Image d’illustration générée</p>
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
  const labPhoto = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLVideoElement>(null);
  const cameras = useRef<(HTMLVideoElement | null)[]>([]);
  const sea = useRef<HTMLVideoElement>(null);
  const exitVideo = useRef<HTMLVideoElement>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const shortScreen = useMediaQuery('(max-height: 500px) and (max-width: 950px)');
  // Les vidéos existent en 1080p pour les grands écrans et en 900p, plus légères, pour les téléphones.
  const narrow = useMediaQuery('(max-width: 999px)');
  const videoSize = narrow ? '-900' : '';
  // Rythme de la sortie filmée : plus lent au doigt, sur un petit écran (voir `exitPaces`).
  setExitPace(narrow ? 'narrow' : 'wide');
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
  // Échecs de la scène 3D (mémoire ou réseau, sur téléphone surtout) : le film continue sans elle et la retente.
  const [failures, setFailures] = useState(0);
  const [broken, setBroken] = useState(false);
  // Sur téléphone, la liste des chapitres s'ouvre depuis une ligne compacte.
  const [menu, setMenu] = useState(false);
  const [lost, setLost] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback((value: boolean) => setLost(value), []);
  // Un échec de la scène 3D ne change jamais de mode : jusqu'au 21 octobre 2026, il remplaçait le film par la lecture
  // simple et la page sautait (« cassure » en fin de parcours sur téléphone, remarque de l'utilisateur). Désormais la 3D
  // se masque, le reste du film (photos, vidéos, textes) continue, et la scène est retentée, cache vidé, à intervalles
  // croissants (`retries`), pour laisser à une coupure passagère le temps de se rétablir. La
  // lecture simple ne s'ouvre plus que par son bouton (ou d'emblée : mouvements réduits, pas de WebGL, écran trop bas).
  const onFailure = useCallback(() => {
    setFailures((count) => count + 1);
    setBroken(true);
  }, []);
  useEffect(() => {
    if (!broken || failures > retries.length) return;
    const retry = window.setTimeout(() => {
      import('./sceneAssets').then(({ clearSceneCache }) => clearSceneCache()).finally(() => setBroken(false));
    }, retries[failures - 1]);
    return () => window.clearTimeout(retry);
  }, [broken, failures]);
  // Les vidéos du navire et la carte attendent la scène 3D, sauf si elle a échoué.
  const mediaReady = ready || failures > 0;
  const possible = supported && !reduced && !shortScreen;
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
    enabled: mediaReady,
    staleTime: Infinity,
    retry: 1,
  });

  useEffect(() => {
    if (!live || !near || !stage.current) return;
    const element = stage.current;
    const videos = [deck.current, sea.current, exitVideo.current];
    const targets = [0, 0, 0];
    // Traversée filmée : le défilement fait avancer la caméra dans la salle, plan après plan (voir `travelShots`).
    const shots = cameras.current.filter((video): video is HTMLVideoElement => Boolean(video));
    const travel = { index: 0, target: 0 };
    // Le plan de sortie est prêt dès sa première image chargée, et le reste : à chaque saut, Safari repasse la vidéo aux
    // seules métadonnées (`readyState` 1) le temps de décoder l'image visée, ce qui ne doit pas la faire disparaître.
    let exitReady = false;
    const scrub = () => {
      const shot = shots[travel.index];
      if (shot && shot.readyState > 0 && !shot.seeking && Math.abs(shot.currentTime - travel.target) > .03) shot.currentTime = travel.target;
    };
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
      // La photo du laboratoire : la paillasse se vide quand le matériel 3D prend le relais, puis la photo s'efface.
      // Sans la scène 3D (pas encore prête, contexte perdu, échec), la photo garde son matériel au lieu de se vider.
      set('--lab-empty', ready && !lost && !broken ? seg(x, collect.swap[0] + .04, collect.swap[1]) : 0);
      // Sortie filmée (voir `exitShot`) : le plan, chargé pendant la collecte, remplace en fondu la photo et les caisses
      // 3D, puis finit sur le fond clair. S'il n'est pas encore chargé, la photo s'efface comme avant.
      const leaving = exitVideo.current;
      if (leaving && x > 0 && leaving.preload !== 'auto') {
        leaving.preload = 'auto';
        leaving.load();
      }
      if (leaving && leaving.readyState >= 2) exitReady = true;
      useFilm.getState().setExitReady(exitReady);
      const arrive = exitReady ? seg(x, exitShot.from, exitShot.from + exitShot.dissolve) : 0;
      const cover = arrive * (1 - seg(x, exitShot.to - .06, exitShot.to + .06));
      // La marche commence pendant le fondu ; le cadrage suit la porte ouverte, puis le conteneur (sur un écran en hauteur).
      const start = exitShot.from + exitShot.dissolve * .4;
      const walking = clamp((x - start) / (exitShot.to - start));
      set('--exit-opacity', arrive);
      set('--exit-x', `${mix(61, 42, seg(walking, 0, exitShot.walk)).toFixed(1)}%`);
      set('--opening-opacity', exitReady ? 1 - seg(x, exitShot.to - .05, exitShot.to) : 1 - seg(x, ...collect.fade));
      // Le masque assombrit le côté du texte ; sur téléphone, le dégradé du bas servait au message d'accueil et s'allège
      // ensuite. Il s'efface pendant la sortie, qui finit sur la lumière.
      set('--opening-mask', openingMask(x, aspect) * (exitReady ? 1 - seg(x, exitShot.from + .02, exitShot.to - .12) : 1));
      if (shots.length) {
        const { index, progress } = travelAt(x);
        travel.index = index;
        shots.forEach((shot, i) => shot.classList.toggle('is-current', x < 0 && i === index));
        const shot = shots[index];
        // Le plan suivant se charge pendant que celui-ci défile. Pendant le fondu d'un plan à l'autre, même après un
        // défilement rapide, le plan quitté montre sa dernière image et le suivant sa première : la photo, des deux côtés.
        const before = shots[index - 1], after = shots[index + 1];
        if (after) {
          after.preload = 'auto';
          if (after.readyState > 0 && !after.seeking && after.currentTime > .03) after.currentTime = 0;
        }
        if (before && before.readyState > 0 && !before.seeking && Math.abs(before.currentTime - (before.duration - .05)) > .03) before.currentTime = before.duration - .05;
        travel.target = Math.max(0, (shot.duration || 8) - .05) * progress;
        scrub();
      }
      // Le fond s'assombrit derrière chaque texte, au rythme de son apparition (0 : message d'accueil, puis les chapitres,
      // puis la bande des étapes de la route, en bas).
      const scrims = element.querySelectorAll<HTMLElement>('.film-scrim');
      const darken = (i: number, value: number) => {
        const scrim = scrims[i];
        if (!scrim) return;
        scrim.style.opacity = String(value);
        scrim.style.visibility = value > 0 ? 'visible' : 'hidden';
      };
      const intro = element.querySelector<HTMLElement>('.film-hero');
      if (intro) {
        const shown = clamp((hero.to - x) / .2);
        intro.style.opacity = String(shown);
        darken(0, shown);
        intro.style.transform = `translateY(${(shown - 1) * 16}px)`;
        // Les motifs autour du message glissent à des vitesses différentes pendant qu'il s'efface.
        intro.style.setProperty('--hero-drift', String(clamp((x + prelude) / (hero.to + prelude))));
        intro.inert = shown < .05;
      }
      element.toggleAttribute('data-intro', x < hero.cue);
      // Cadrage de la photo, partagé avec la caméra 3D (`labFrame`).
      if (labPhoto.current) {
        const frame = labFrame(element.clientWidth, element.clientHeight, x);
        Object.assign(labPhoto.current.style, { width: `${frame.w}px`, height: `${frame.h}px`, left: `${frame.left}px`, top: `${frame.top}px` });
      }
      set('--canvas-opacity', seg(x, collect.swap[0], collect.swap[0] + .08) * (1 - seg(x, 6.52, 6.87)) * (1 - cover));
      element.querySelector('.film-canvas')?.toggleAttribute('data-off', !sceneShown(x) || (exitReady && exitCovers(x)));
      element.querySelectorAll<HTMLElement>('.film-ghost').forEach((ghost, i) => {
        const { from, to } = ghosts[i];
        ghost.style.opacity = String(seg(x, from, from + .4) * (1 - seg(x, to - .4, to)));
        ghost.style.transform = `translateX(${mix(10, -40, seg(x, from, to))}%)`;
      });
      // Les étapes de la collecte avancent avec le matériel, jusqu'à la fermeture des caisses.
      set('--steps-opacity', seg(x, .6, .85) * (1 - seg(x, 2.2, 2.45)));
      element.querySelectorAll<HTMLElement>('.film-steps li').forEach((item, i) => item.classList.toggle('is-active', x >= stepStarts[i]));
      // Sous-titres de la mise en caisses, l'un après l'autre, au-dessus du matériel en vol ; leur voile ne couvre que le
      // haut de l'écran, pour que le matériel reste dégagé.
      element.querySelectorAll<HTMLElement>('.film-caption').forEach((caption, i) => {
        const [from, to] = captionRange(captions[i].step);
        const visible = clamp(Math.min((x - from) / .1, (to - x) / .1));
        caption.style.opacity = String(visible);
        caption.style.transform = `translateY(${(1 - visible) * 12}px)`;
        caption.setAttribute('aria-hidden', String(visible < .05));
      });
      darken(cards.length + 2, seg(x, stepStarts[1] - .05, stepStarts[1] + .1) * (1 - seg(x, captionsEnd() - .1, captionsEnd() + .02)));
      set('--band-shift', `${mix(0, -55, seg(x, 4.45, 5.4))}%`);
      const band = seg(x, 4.25, 4.81) * (1 - seg(x, 5.29, 5.51));
      set('--band-opacity', band);
      darken(cards.length + 1, band);
      // Vue du ciel, la route s'ouvre sur le pont du navire : d'abord dans son couloir, puis plein écran.
      const open = seg(x, 6.42, 6.77), half = stripWidth(aspect) * 50;
      set('--reveal-clip', `inset(${mix(100, 0, seg(x, 6.17, 6.42))}% ${mix(100 - deckLane * 100 - half, 0, open)}% 0 ${mix(deckLane * 100 - half, 0, open)}%)`);
      // Le fondu vers la mer attend que la proue soit entrée dans l'image.
      set('--sea-opacity', seg(x, 7.22, 7.67));
      set('--sea-scale', mix(1.18, 1, seg(x, 7.07, 8.87)));
      set('--shade-opacity', seg(x, 7.27, 7.87) * .3 + seg(x, 8.57, 9.17) * .45);
      set('--tint-opacity', seg(x, 6.42, 6.67) * .42 - seg(x, 7.27, 7.87) * .27 + seg(x, 8.57, 9.17) * .4);
      set('--map-opacity', seg(x, 8.57, 9.07));
      set('--map-scale', mix(.62, 1, seg(x, 8.57, 9.87)));
      set('--route-draw', 1 - seg(x, 8.67, 9.47));
      // Le plan du pont ne garde que sa fin (9,2 s, des grues à la proue) : 8,8 s sur 1,3 écran, soit la vitesse d'origine (13,5 s sur 2 écrans).
      targets[0] = .35 + 8.8 * seg(x, 6.17, 7.47);
      targets[1] = 19.5 * seg(x, 7.07, 9.17);
      targets[2] = Math.max(0, (leaving?.duration || 8) - .05) * walking;
      seek();
      element.querySelectorAll<HTMLElement>('.film-card').forEach((card, i) => {
        const { from, to } = cards[i];
        const visible = clamp(Math.min((x - from) / .2, (to - x) / .2));
        card.style.opacity = String(visible);
        card.style.transform = `translateY(${(1 - visible) * 16}px)`;
        darken(i + 1, visible);
        card.setAttribute('aria-hidden', String(visible < .05));
        card.inert = visible < .05;
      });
    };
    paint();
    videos.forEach((video) => video?.addEventListener('seeked', seek));
    videos[2]?.addEventListener('loadeddata', paint);
    shots.forEach((shot) => shot.addEventListener('seeked', scrub));
    window.addEventListener('resize', paint);
    const unsubscribe = useFilm.subscribe(paint);
    return () => {
      unsubscribe();
      window.removeEventListener('resize', paint);
      videos.forEach((video) => video?.removeEventListener('seeked', seek));
      videos[2]?.removeEventListener('loadeddata', paint);
      shots.forEach((shot) => shot.removeEventListener('seeked', scrub));
    };
  }, [live, near, ready, mediaReady, lost, broken]);

  const seekChapter = (index: number) => {
    const element = track.current;
    const stageHeight = stage.current?.offsetHeight ?? window.innerHeight;
    if (!element) return;
    // Atteindre le texte pleinement visible, après son fondu d’entrée ; le premier chapitre ramène au message d'accueil.
    const destination = index === 0 ? -prelude : Math.max(chapters[index].start, cards[index].from + .2);
    scrollImmediately(window.scrollY + element.getBoundingClientRect().top + progressAt(destination) * (element.offsetHeight - stageHeight));
    setMenu(false);
  };
  const changeMode = () => {
    setSimple((value) => !value);
    requestAnimationFrame(() => document.getElementById('le-voyage')?.scrollIntoView());
  };

  if (!live) return <div id="le-voyage"><StaticFilm onAnimate={possible ? changeMode : undefined} /></div>;
  return <section id="le-voyage" ref={track} className="film" style={{ height: `${(filmScreens() + 1) * 100}svh` }} aria-label="Le voyage du matériel scientifique, de l’Europe à la RDC">
    <div ref={stage} className="film-stage" data-intro="">
      <div className="film-progress" aria-hidden="true" />
      <div className="film-video film-opening" aria-hidden="true">
        {/* Photo du laboratoire, puis la même paillasse vidée, au cadrage de la caméra 3D. */}
        <div ref={labPhoto} className="film-lab">
          <img src={`${media.lab}.jpg`} alt="" width={lab.width} height={lab.height} fetchPriority="high" />
          <img className="film-lab-empty" src={`${media.lab}-vide.jpg`} alt="" width={lab.width} height={lab.height} />
          {/* Traversée filmée : la caméra recule jusqu'au cadre de la photo ; le défilement la fait avancer. */}
          {travelShots.map((shot, i) => <video key={shot.name} ref={(video) => { cameras.current[i] = video; }} className={`film-lab-video${i === 0 ? ' is-current' : ''}`}
            src={`${media.lab}-${shot.name}${shot.small ? videoSize : ''}.mp4`} poster={i === 0 ? `${media.lab}-${shot.name}.jpg` : undefined} muted playsInline preload={i < 2 ? 'auto' : 'none'} />)}
        </div>
        {/* Sortie filmée : de la porte du fond jusqu'à la cour et sa lumière ; le défilement la fait avancer. */}
        <video ref={exitVideo} className="film-exit" src={`${media.lab}-sortie${videoSize}.mp4`} muted playsInline preload="none" />
        {/* Texture de l'ouverture : sur tout l'écran, elle apparaît et s'efface avec la photo. */}
        <div className="film-hero-motif"><div className="motif-texture is-hero" /></div>
      </div>
      {ghosts.map((ghost) => <p key={ghost.word} className={`film-ghost is-${ghost.tone}`} aria-hidden="true">{ghost.word}</p>)}
      <div className="film-canvas" aria-hidden="true" data-lost={lost || broken ? '' : undefined}>
        {near && !broken && <CanvasBoundary key={failures} onFailure={onFailure}><Suspense fallback={null}><FilmCanvas onReady={onReady} onLost={onLost} /></Suspense></CanvasBoundary>}
      </div>
      {near && !ready && !failures && <p className="film-loading" role="status">Le matériel se prépare…</p>}
      <ol className="film-steps" aria-hidden="true">
        {steps.map((step, i) => <li key={step}><span>0{i + 1}</span>{step}</li>)}
      </ol>
      <ol className="film-band" aria-hidden="true">
        {milestones.map((milestone, i) => <li key={milestone}><span>0{i + 1}</span>{milestone}</li>)}
      </ol>
      {/* Les vidéos du navire ne servent qu'à mi-parcours : elles se chargent une fois la scène prête. */}
      <div className="film-video film-deck" aria-hidden="true">
        {mediaReady && <video ref={deck} src={`${media.deck}${videoSize}.mp4`} poster={`${media.deck}.jpg`} muted playsInline preload="auto" />}
      </div>
      <div className="film-video film-sea" aria-hidden="true">
        {mediaReady && <video ref={sea} src={`${media.sea}${videoSize}.mp4`} poster={`${media.sea}.jpg`} muted playsInline preload="auto" />}
      </div>
      <div className="film-tint" aria-hidden="true" />
      <div className="film-shade" aria-hidden="true" />
      <div className="film-map" aria-hidden="true">
        <ProvinceLayer shapes={provinces} />
        <svg viewBox="0 0 720 650">
          <path className="film-route" d={route} pathLength={1} />
          <circle className="film-arrival" cx="76" cy="374" r="9" />
        </svg>
      </div>
      {/* Voiles derrière les textes : le message d'accueil, puis chaque chapitre, du côté de son texte. */}
      <div className="film-scrims" aria-hidden="true">
        <div className="film-scrim is-hero" />
        {cards.map((card) => <div key={card.id} className={`film-scrim is-${card.place}`} />)}
        <div className="film-scrim is-band" />
        <div className="film-scrim is-caption" />
      </div>
      <div className="film-hero"><MotifField set="hero" drift={false} /><HeroCopy /></div>
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
      <div className="film-captions">
        {captions.map((caption) => <div key={caption.step} className="film-caption" aria-hidden="true">
          <p className="film-kicker">0{caption.step + 1} · {steps[caption.step]}</p>
          <h3>{caption.title}</h3>
          <p className="film-text">{caption.text}</p>
        </div>)}
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
