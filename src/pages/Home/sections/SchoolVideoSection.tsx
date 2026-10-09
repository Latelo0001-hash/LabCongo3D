import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { clamp, mix, seg } from "../../../features/film/filmTimeline";
import { scramble } from "../../../features/film/scramble";
import "./school-video.css";

const media = "/media/parcours/ecole";
const title = "Équiper pour permettre l’expérimentation.";
const text = "En RDC, le matériel rejoint les écoles. Il est installé dans la salle de sciences, puis les élèves s’en servent en séance pratique, avec leur enseignant.";
const disclosure = "Séquence générée : elle illustre le projet, elle ne montre pas une école équipée par LabCongo.";

// Même grammaire que le film d'ouverture : scène fixe, vidéo pilotée image par image par le défilement,
// ouverture par masque et titre décodé. Version fixe si les animations sont réduites.
export default function SchoolVideoSection() {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const shortScreen = useMediaQuery("(max-height: 500px) and (max-width: 950px)");
  const live = !reduced && !shortScreen;
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = track.current;
    if (!live || !element) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setNear(true);
        observer.disconnect();
      }
    }, { rootMargin: "200% 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [live]);

  useEffect(() => {
    const element = track.current, scene = stage.current, player = video.current;
    if (!live || !near || !element || !scene || !player) return;
    const heading = scene.querySelector<HTMLElement>(".school-scroll-title-text");
    let frame = 0, target = 0;
    let decoded: (() => void) | null = null;
    const seek = () => {
      if (player.readyState > 0 && !player.seeking && Math.abs(player.currentTime - target) > .03) player.currentTime = target;
    };
    const paint = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const p = clamp(-rect.top / Math.max(1, element.offsetHeight - scene.offsetHeight));
      const open = seg(p, 0, .3);
      // La vidéo s'ouvre depuis une fente verticale, comme la route s'ouvre sur le navire.
      scene.style.setProperty("--school-clip", `inset(${mix(18, 0, open)}% ${mix(44, 0, open)}% ${mix(18, 0, open)}% ${mix(44, 0, open)}%)`);
      scene.style.setProperty("--school-progress", String(p));
      const visible = clamp(Math.min((p - .18) / .1, (1.05 - p) / .1));
      scene.style.setProperty("--school-text", String(visible));
      scene.style.setProperty("--school-tint", String(seg(p, .15, .35) * .55));
      if (visible > .05 && !decoded && heading) decoded = scramble(heading, title);
      if (visible <= .05 && decoded) { decoded(); decoded = null; }
      target = (player.duration || 5.7) * seg(p, 0, 1);
      seek();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    player.addEventListener("seeked", seek);
    player.addEventListener("loadedmetadata", schedule);
    return () => {
      cancelAnimationFrame(frame);
      decoded?.();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      player.removeEventListener("seeked", seek);
      player.removeEventListener("loadedmetadata", schedule);
    };
  }, [live, near]);

  if (!live) return (
    <section id="ecole" className="school-video" aria-labelledby="school-video-title">
      <div className="container school-video-layout">
        <div className="school-video-text">
          <p className="eyebrow">À l’arrivée · L’école</p>
          <h2 id="school-video-title">Équiper pour permettre <em>l’expérimentation.</em></h2>
          <p>{text}</p>
        </div>
        <figure className="school-video-media">
          <img src={`${media}.jpg`} alt="Image d’illustration : des élèves en uniforme utilisent des microscopes en classe, avec leur enseignant." width="1280" height="720" loading="lazy" />
          <figcaption>{disclosure}</figcaption>
        </figure>
      </div>
    </section>
  );

  return (
    <section id="ecole" ref={track} className="school-scroll" aria-labelledby="school-video-title">
      <div ref={stage} className="school-scroll-stage">
        <div className="school-scroll-progress" aria-hidden="true" />
        <div className="school-scroll-video" aria-hidden="true">
          {near && <video ref={video} src={`${media}.mp4`} poster={`${media}.jpg`} muted playsInline preload="auto" />}
        </div>
        <div className="school-scroll-tint" aria-hidden="true" />
        <div className="school-scroll-card">
          <p className="school-scroll-kicker">À l’arrivée · L’école</p>
          <h2 id="school-video-title" aria-label={title}><span className="school-scroll-title-text" aria-hidden="true">{title}</span></h2>
          <p className="school-scroll-text">{text}</p>
        </div>
        <p className="school-scroll-disclosure">{disclosure}</p>
      </div>
    </section>
  );
}
