import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { clamp, mix, seg } from './filmTimeline';
import './film.css';
import './schoolFilm.css';

// Parcours en RDC, suite du film d'ouverture et même grammaire : scène fixe pilotée par le défilement, vidéos suivies
// image par image, fond assombri derrière chaque texte. L'équipe de l'école ouvre le conteneur, le laboratoire s'équipe,
// puis la leçon. Repères en écrans de défilement, de 0 à `screens`.
const media = '/media/parcours/ecole';
const screens = 3.5;
// Chaque vidéo apparaît en fondu sur la précédente, à partir de `from` (choix de l'utilisateur, qui préfère le fondu à
// l'ouverture depuis une fente centrale) ; une image reste toujours à l'écran. `play` : plage où une vidéo avance
// (l'installation finit avant que la leçon n'apparaisse). L'utilisateur a retiré du film les photos du laboratoire
// équipé et de la classe, qui suivaient l'installation : elles ne servent plus qu'à la version fixe.
// L'installation : les caisses du laboratoire s'ouvrent et le matériel 3D se pose sur les paillasses, comme la collecte
// du film d'ouverture à l'envers (rendue à l'avance par scripts/installation : une seconde scène 3D en direct ferait
// décrocher les téléphones). La salle s'équipe de gauche à droite ; sur un écran étroit, qui n'en montre qu'un quart, le
// cadre suit le matériel (`pan` : repères [avancement de la vidéo, position horizontale en %]) et l'installation dure
// `slowInstallation` fois plus longtemps, pour que ce glissement reste lent.
type Shot = { name: string; small?: boolean; src: string; poster: string; from: number; play: readonly [number, number]; pan?: readonly (readonly [number, number])[]; position: string };
const shots: Shot[] = [
  { name: 'portes', src: `${media}-portes.mp4`, poster: `${media}-portes.jpg`, from: 0, play: [.02, 1.4], position: '52% 50%' },
  { name: 'installation', small: true, src: `${media}-installation.mp4`, poster: `${media}-installation.jpg`, from: 1.2, play: [1.32, 2.4], pan: [[0, 50], [.14, 50], [.4, 4], [.48, 4], [.96, 100]], position: '50% 50%' },
  { name: 'lecon', src: `${media}-lecon.mp4`, poster: `${media}-lecon.jpg`, from: 2.45, play: [2.5, 3.2], position: '50% 50%' },
];
const reveal = .22;
const slowInstallation = 1.8;
const installation = shots[1].play;
// Écrans de défilement → repères du film : sur écran étroit, la plage de l'installation est étirée de `slow`.
const filmAt = (scrolled: number, slow: number) => {
  const [from, to] = installation;
  const end = from + (to - from) * slow;
  return scrolled < from ? scrolled : scrolled < end ? from + (scrolled - from) / slow : scrolled - (end - to);
};
const along = (keys: readonly (readonly [number, number])[], t: number) => {
  const next = keys.findIndex(([at]) => t <= at);
  if (next <= 0) return keys[next < 0 ? keys.length - 1 : 0][1];
  return mix(keys[next - 1][1], keys[next][1], seg(t, keys[next - 1][0], keys[next][0]));
};
type Text = { from: number; to: number; kicker: string; title: string; accent?: string; text: string };
// Les textes reprennent le parcours décrit sur le site (`journeySteps`, `process`).
const chapters: Text[] = [
  { from: .1, to: .75, kicker: '07 / L’arrivée · L’école', title: 'Réceptionner et vérifier.', accent: 'et vérifier.', text: 'À l’arrivée, le matériel est contrôlé et rapproché de son inventaire, puis orienté vers l’établissement bénéficiaire.' },
  { from: 1.38, to: 1.9, kicker: '08 / L’installation · Le laboratoire', title: 'Donner vie au laboratoire.', accent: 'au laboratoire.', text: 'L’installation et les essais précèdent la prise en main.' },
  { from: 2.52, to: screens + 1, kicker: '09 / L’utilisation · Les élèves', title: 'Observer, manipuler et apprendre ensemble.', accent: 'apprendre ensemble.', text: 'Enseignants et élèves sont accompagnés dans la prise en main du matériel et les pratiques de sécurité.' },
];
const captions: Text[] = [
  { from: .8, to: 1.2, kicker: 'Contrôler', title: 'Chaque caisse est vérifiée.', text: 'Son contenu est rapproché de l’inventaire établi avant le départ.' },
  { from: 1.95, to: 2.45, kicker: 'Installer et tester', title: 'Chaque appareil trouve sa place.', text: 'Les équipements sont installés et testés dans un espace adapté aux activités scientifiques de l’établissement.' },
];
const disclosure = 'Illustrations générées : elles ne montrent pas une école équipée par LabCongo.';
// Version fixe (mouvements réduits, petit écran en paysage) : un plan par chapitre.
const stills = [
  { src: `${media}-cour.jpg`, alt: 'Image d’illustration générée : dans la cour d’une école secondaire de RDC, l’équipe de l’établissement attend devant un camion portant un conteneur bleu.' },
  { src: `${media}-labo-equipe.jpg`, alt: 'Image d’illustration générée : le laboratoire rénové d’une école secondaire, paillasses équipées de microscopes, de tubes à essai et de verrerie.' },
  { src: `${media}-eleves.jpg`, alt: 'Image d’illustration générée : des élèves en blouse blanche et uniforme bleu et blanc travaillent aux microscopes avec leur enseignante.' },
];

const Title = ({ title, accent }: { title: string; accent?: string }) => accent && title.endsWith(accent)
  ? <>{title.slice(0, -accent.length)}<em>{accent}</em></>
  : <>{title}</>;

export default function SchoolFilm() {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  // Décidé au chargement, comme pour le film d'ouverture : un écran qui passe sous 500 px de haut ne change pas de version.
  const [shortScreen] = useState(() => matchMedia('(max-height: 500px) and (max-width: 950px)').matches);
  const live = !reduced && !shortScreen;
  // `small` : une version 900p, plus légère, sert sous 1000 px de large.
  const narrow = useMediaQuery('(max-width: 999px)');
  // Le suivi de l'installation, lui, est décidé au chargement : il change la longueur du film.
  const [follow] = useState(() => matchMedia('(max-width: 999px)').matches);
  const slow = follow ? slowInstallation : 1;
  const length = screens + (installation[1] - installation[0]) * (slow - 1);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = track.current;
    if (!live || !element) return;
    // Les médias se chargent à un écran de distance, une fois le film d'ouverture loin derrière.
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setNear(true);
        observer.disconnect();
      }
    }, { rootMargin: '100% 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, [live]);

  useEffect(() => {
    const element = track.current, scene = stage.current;
    if (!live || !near || !element || !scene) return;
    const layers = [...scene.querySelectorAll<HTMLElement>('.school-film-shot')];
    const videos = layers.map((layer) => layer.querySelector('video'));
    const targets = shots.map(() => 0);
    let frame = 0;
    // Les vidéos suivent le défilement image par image, dans les deux sens.
    const seek = () => videos.forEach((video, i) => {
      if (video && video.readyState > 0 && !video.seeking && Math.abs(video.currentTime - targets[i]) > .03) video.currentTime = targets[i];
    });
    const paint = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const p = clamp(-rect.top / Math.max(1, element.offsetHeight - scene.offsetHeight));
      const x = filmAt(p * length, slow);
      scene.style.setProperty('--school-film-progress', String(p));
      shots.forEach((shot, i) => {
        const layer = layers[i];
        if (!layer) return;
        const next = shots[i + 1];
        const entered = i === 0 ? 1 : seg(x, shot.from, shot.from + reveal);
        // Un plan entièrement recouvert par le suivant n'est plus dessiné.
        const covered = next ? seg(x, next.from, next.from + reveal) >= 1 : false;
        layer.style.visibility = entered > 0 && !covered ? 'visible' : 'hidden';
        layer.style.opacity = String(entered);
        const video = videos[i];
        if (!video) return;
        const played = clamp((x - shot.play[0]) / (shot.play[1] - shot.play[0]));
        targets[i] = Math.max(0, (video.duration || 8) - .05) * played;
        if (shot.pan && follow) video.style.objectPosition = `${along(shot.pan, played).toFixed(2)}% 50%`;
      });
      seek();
      // Textes et voiles : chapitres, puis sous-titres, chacun avec son voile du côté du texte.
      const scrims = scene.querySelectorAll<HTMLElement>('.film-scrim');
      const show = (items: NodeListOf<HTMLElement>, texts: Text[], offset: number) => items.forEach((item, i) => {
        const { from, to } = texts[i];
        const visible = clamp(Math.min((x - from) / .12, (to - x) / .12));
        item.style.opacity = String(visible);
        item.style.transform = `translateY(${(1 - visible) * 14}px)`;
        item.setAttribute('aria-hidden', String(visible < .05));
        const scrim = scrims[offset + i];
        if (scrim) {
          scrim.style.opacity = String(visible);
          scrim.style.visibility = visible > 0 ? 'visible' : 'hidden';
        }
      });
      show(scene.querySelectorAll<HTMLElement>('.film-card'), chapters, 0);
      show(scene.querySelectorAll<HTMLElement>('.film-caption'), captions, chapters.length);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    videos.forEach((video) => {
      video?.addEventListener('seeked', seek);
      video?.addEventListener('loadedmetadata', schedule);
    });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      videos.forEach((video) => {
        video?.removeEventListener('seeked', seek);
        video?.removeEventListener('loadedmetadata', schedule);
      });
    };
  }, [live, near, follow, slow, length]);

  if (!live) return (
    <section id="ecole" className="school-film-static" aria-labelledby="school-film-title">
      <div className="container">
        <p className="eyebrow" id="school-film-title">En RDC · De l’arrivée à la première expérience</p>
        {chapters.map((chapter, i) => <article key={chapter.kicker} className="school-film-chapter">
          <img src={stills[i].src} alt={stills[i].alt} width="1920" height="1072" loading="lazy" />
          <div>
            <p className="film-kicker">{chapter.kicker}</p>
            <h2><Title title={chapter.title} accent={chapter.accent} /></h2>
            <p className="film-text">{chapter.text}</p>
          </div>
        </article>)}
        <p className="school-film-note">{disclosure}</p>
      </div>
    </section>
  );

  return (
    <section id="ecole" ref={track} className="school-film" style={{ height: `${(length + 1) * 100}svh` }} aria-label="En RDC : l’arrivée du matériel à l’école, l’installation et l’utilisation">
      <div ref={stage} className="school-film-stage">
        <div className="school-film-progress" aria-hidden="true" />
        {shots.map((shot) => <div key={shot.name} className="school-film-shot" aria-hidden="true">
          {near && <video src={shot.small && narrow ? shot.src.replace('.mp4', '-900.mp4') : shot.src} poster={shot.poster} muted playsInline preload="auto" style={{ objectPosition: shot.position }} />}
        </div>)}
        <div className="film-scrims" aria-hidden="true">
          {chapters.map((chapter) => <div key={chapter.kicker} className="film-scrim is-top-left" />)}
          {captions.map((caption) => <div key={caption.kicker} className="film-scrim is-caption" />)}
        </div>
        <div className="film-cards">
          {chapters.map((chapter) => <div key={chapter.kicker} className={`film-card is-top-left is-light${chapter.title.length > 40 ? ' is-long' : ''}`} aria-hidden="true">
            <p className="film-kicker">{chapter.kicker}</p>
            <h2><Title title={chapter.title} accent={chapter.accent} /></h2>
            <p className="film-text">{chapter.text}</p>
          </div>)}
        </div>
        <div className="film-captions">
          {captions.map((caption) => <div key={caption.kicker} className="film-caption" aria-hidden="true">
            <p className="film-kicker">{caption.kicker}</p>
            <h3>{caption.title}</h3>
            <p className="film-text">{caption.text}</p>
          </div>)}
        </div>
        <p className="school-film-note">{disclosure}</p>
      </div>
    </section>
  );
}
