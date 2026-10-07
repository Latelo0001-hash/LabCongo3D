import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { ArrowDown, ArrowUpRight, MoveDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { chapters, chapterIndex, between, clamp, interpolate, mix, sample } from './timeline';
import { seekChapter, useJourney, useJourneyScroll } from './useJourney';
import './immersive.css';
import { scrollImmediately } from '../../lib/lenis';
import FilmSequence from '../film/FilmSequence';

const JourneyCanvas = lazy(() => import('./JourneyCanvas'));
class CanvasBoundary extends Component<PropsWithChildren<{ onFailure: () => void }>, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function ImmersiveJourney() {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const shortScreen = useMediaQuery('(max-height: 500px) and (max-width: 950px)');
  const [simple, setSimple] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [supported] = useState(() => {
    try {
      const context = document.createElement('canvas').getContext('webgl2');
      const available = Boolean(context);
      context?.getExtension('WEBGL_lose_context')?.loseContext();
      return available;
    } catch { return false; }
  });
  const active = useJourney((state) => chapterIndex(state.progress));
  const animated = !simple && !reduced && !shortScreen && supported && !failed;
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setFailed(true), []);
  useJourneyScroll(track, animated);

  useEffect(() => {
    if (!animated || !stage.current) return;
    const element = stage.current;
    const paint = () => {
      const p = useJourney.getState().progress;
      const { index, t } = sample(p);
      const color = chapters[index].color.map((value, axis) => Math.round(mix(value, chapters[index + 1].color[axis], t)));
      element.style.setProperty('--scene-color', color.join(', '));
      element.style.setProperty('--journey-progress', String(p));
      element.style.setProperty('--text-side', String(interpolate([1, 0, 1, 0, 1], p)));
      // Le décor suit le même défilement que les objets, y compris en retour arrière.
      const photoPosition = p * 4;
      const photoIndex = Math.min(3, Math.floor(photoPosition));
      const photoFade = between(photoPosition - photoIndex, .42, .58);
      element.querySelectorAll<HTMLImageElement>('.journey-atmosphere img').forEach((photo, i) => {
        const distance = Math.abs(photoPosition - i);
        photo.style.opacity = String(i === photoIndex ? 1 - photoFade : i === photoIndex + 1 ? photoFade : 0);
        photo.style.transform = `scale(${1.02 + Math.min(distance, 1) * .025})`;
      });
      // Les cinq textes restent dans le document ; un seul est interactif/lisible à la fois.
      element.querySelectorAll<HTMLElement>('.journey-copy').forEach((copy, i) => {
        const distance = Math.abs(p * 4 - i);
        copy.style.opacity = String(clamp((0.49 - distance) / 0.15));
        copy.style.transform = `translateY(${Math.min(distance, 1) * 18}px)`;
      });
    };
    paint();
    return useJourney.subscribe(paint);
  }, [animated, active]);

  // Un GLB indisponible ne doit pas laisser un écran vide indéfiniment.
  useEffect(() => {
    if (!animated || ready) return;
    const timer = window.setTimeout(onFailure, 20000);
    return () => window.clearTimeout(timer);
  }, [animated, ready, onFailure]);

  const changeMode = () => {
    scrollImmediately(window.scrollY);
    setSimple((value) => !value);
    requestAnimationFrame(() => {
      if (animated) {
        const chapter = document.getElementById(`recit-${chapters[active].id}`);
        if (chapter) scrollImmediately(window.scrollY + chapter.getBoundingClientRect().top - 30);
      }
      else seekChapter(track.current, active);
    });
  };

  return <><section ref={track} className={`immersive-journey ${animated ? 'is-animated' : 'is-simple'}`} aria-label="Le voyage du matériel scientifique">
    {animated ? <div ref={stage} className="journey-stage" data-chapter={chapters[active].id}>
      <div className="journey-progress" aria-hidden="true" />
      <div className="journey-atmosphere" aria-hidden="true">
        {chapters.map((chapter, i) => i <= active + 1 && <img key={chapter.id} src={chapter.image} alt="" className={active === i ? 'is-current' : ''} fetchPriority={i === 0 ? 'high' : 'auto'} />)}
      </div>
      <div className="journey-canvas" aria-hidden="true">
        <CanvasBoundary onFailure={onFailure}><Suspense fallback={null}><JourneyCanvas onReady={onReady} onFailure={onFailure} /></Suspense></CanvasBoundary>
      </div>
      {!ready && <p className="journey-loading" role="status">La scène se prépare…</p>}
      <span className="journey-giant-number" aria-hidden="true">0{active + 1}</span>
      <div className="journey-copies">
        {chapters.map((chapter, i) => <div key={chapter.id} className={`journey-copy on-${chapter.side}`} aria-hidden={i !== active} inert={i !== active}>
          <p className="journey-kicker">{chapter.place}</p>
          {i === 0 ? <h1>{chapter.title}</h1> : <h2>{chapter.title}</h2>}
          <p className="journey-description">{chapter.text}</p>
          {i === 4 && <a href="#decouvrir" className="journey-link">Découvrir le projet <ArrowUpRight size={18} /></a>}
        </div>)}
      </div>
      <div className="journey-bottom">
        <a href="#decouvrir" className="journey-skip"><MoveDown size={18} aria-hidden="true" /><span>Défiler pour découvrir</span></a>
        <nav className="journey-chapters" aria-label="Étapes du récit">
          {chapters.map((chapter, i) => <button key={chapter.id} type="button" aria-label={`Étape ${i + 1} : ${chapter.label}`} aria-current={i === active ? 'step' : undefined} onClick={() => seekChapter(track.current, i)}><span>0{i + 1}</span><span className="journey-chapter-label">{chapter.label}</span></button>)}
        </nav>
        <button type="button" className="journey-mode" onClick={changeMode}>Lecture simple</button>
      </div>
      <p className="journey-disclosure">Scénographie illustrative · Images générées</p>
    </div> : <div className="journey-simple">
      <div className="journey-simple-tools">
        <p>Le voyage du matériel · Europe → RDC</p>
        {supported && !failed && !reduced && !shortScreen && <button type="button" onClick={changeMode}>Activer la scène au défilement</button>}
      </div>
      {chapters.map((chapter, i) => <article id={`recit-${chapter.id}`} key={chapter.id} className="journey-simple-chapter">
        <img src={chapter.image} alt={chapter.alt} loading={i === 0 ? 'eager' : 'lazy'} width="1280" height="720" />
        <div><p className="journey-kicker">{chapter.place}</p>{i === 0 ? <h1>{chapter.title}</h1> : <h2>{chapter.title}</h2>}<p>{chapter.text}</p></div>
      </article>)}
      <p className="journey-simple-note">Scénographie illustrative. Les images générées présentent le récit envisagé ; elles ne documentent pas des interventions réalisées.</p>
    </div>}
    </section><FilmSequence animated={animated} /><div className="journey-access" id="decouvrir">
      <div className="container">
        <p className="eyebrow">LabCongo · La science en pratique</p>
        <h2>Donner une seconde vie au matériel scientifique.<br /><em>Ouvrir de nouvelles possibilités d’apprentissage.</em></h2>
        <p>Un projet pour rapprocher les instruments disponibles en Europe des besoins des écoles de la République démocratique du Congo.</p>
        <div className="journey-access-links">
          {[['Le projet', '/a-propos'], ['Les écoles', '/ecoles'], ['Les équipements', '/equipements'], ['Les réalisations', '/projets'], ['Les partenaires', '/partenaires'], ['Les actualités', '/actualites'], ['Nous contacter', '/contact']].map(([label, to]) => <Link key={to} to={to}>{label}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}
        </div>
        <a className="journey-support" href="#agir">Soutenir LabCongo <ArrowDown size={18} aria-hidden="true" /></a>
      </div>
    </div>
  </>;
}
