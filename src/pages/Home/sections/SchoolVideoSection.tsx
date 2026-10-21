import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { clamp, mix, seg } from "../../../features/film/filmTimeline";
import "./school-video.css";

const media = "/media/parcours/ecole";
const title = "Quand la leçon devient expérience.";
const text = "Permettre aux élèves de manipuler, d’observer et de comprendre avec leur enseignant : c’est le sens du projet. Un équipement devient utile lorsqu’il trouve sa place dans l’apprentissage.";
const disclosure = "Vidéo d’illustration (cottonbro studio, Pexels) : elle ne montre pas une école équipée par LabCongo.";

// Même grammaire que le film d'ouverture : scène fixe, vidéo pilotée image par image par le défilement,
// ouverture par masque. Texte stable et version fixe si les animations sont réduites.
export default function SchoolVideoSection() {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const shortScreen = useMediaQuery("(max-height: 500px) and (max-width: 950px)");
  const live = !reduced && !shortScreen;
  // Comme pour le film, une version 900p plus légère pour les téléphones.
  const videoSize = useMediaQuery("(max-width: 999px)") ? "-900" : "";
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = track.current;
    if (!live || !element) return;
    // Chargement à un écran de distance : sur téléphone, la vidéo ne s'ajoute pas à la mémoire du film tant qu'il défile.
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setNear(true);
        observer.disconnect();
      }
    }, { rootMargin: "100% 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [live]);

  useEffect(() => {
    const element = track.current, scene = stage.current, player = video.current;
    if (!live || !near || !element || !scene || !player) return;
    let frame = 0, target = 0;
    const seek = () => {
      if (player.readyState > 0 && !player.seeking && Math.abs(player.currentTime - target) > .03) player.currentTime = target;
    };
    const paint = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const p = clamp(-rect.top / Math.max(1, element.offsetHeight - scene.offsetHeight));
      const open = seg(p, 0, .3);
      // Barres du format cinéma (2,2:1) sur les écrans larges ; elles s'écartent quand la réaction commence.
      const aspect = scene.offsetWidth / Math.max(1, scene.offsetHeight);
      const bars = (aspect >= 1.2 ? clamp(50 * (1 - aspect / 2.2), 0, 10) : 0) * (1 - seg(p, .6, .82));
      // La vidéo s'ouvre depuis une fente verticale, comme la route s'ouvre sur le navire.
      scene.style.setProperty("--school-clip", `inset(${mix(18, bars, open)}% ${mix(44, 0, open)}% ${mix(18, bars, open)}% ${mix(44, 0, open)}%)`);
      // Caméra : recul et mise au point pendant l'ouverture, lente poussée vers l'élève, puis la lumière monte avec la réaction.
      scene.style.setProperty("--school-zoom", String(mix(1.16, 1.02, open) + .07 * seg(p, .3, 1)));
      const blur = 12 * (1 - seg(p, .02, .26)), glow = seg(p, .72, .86);
      scene.style.setProperty("--school-filter", blur > .1 || glow > .01 ? `blur(${blur.toFixed(1)}px) brightness(${(1 + .08 * glow).toFixed(3)}) saturate(${(1 + .25 * glow).toFixed(3)})` : "none");
      scene.style.setProperty("--school-progress", String(p));
      const visible = clamp(Math.min((p - .18) / .1, (1.05 - p) / .1));
      scene.style.setProperty("--school-text", String(visible));
      scene.style.setProperty("--school-tint", String(seg(p, .15, .35) * .55));
      target = (player.duration || 23) * seg(p, 0, 1);
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
          <p className="eyebrow">La finalité · Apprendre par la pratique</p>
          <h2 id="school-video-title">Quand la leçon <em>devient expérience.</em></h2>
          <p>{text}</p>
        </div>
        <figure className="school-video-media">
          <img src={`${media}.jpg`} alt="Image d’illustration : un élève en blouse blanche, assis près d’un microscope, prépare une expérience de chimie au laboratoire." width="1280" height="720" loading="lazy" />
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
          {near && <video ref={video} src={`${media}${videoSize}.mp4`} poster={`${media}.jpg`} muted playsInline preload="auto" />}
          <div className="school-scroll-lens" />
        </div>
        <div className="school-scroll-tint" aria-hidden="true" />
        <div className="school-scroll-card">
          <p className="school-scroll-kicker">La finalité · Apprendre par la pratique</p>
          <h2 id="school-video-title">{title}</h2>
          <p className="school-scroll-text">{text}</p>
        </div>
        <p className="school-scroll-disclosure">{disclosure}</p>
      </div>
    </section>
  );
}
