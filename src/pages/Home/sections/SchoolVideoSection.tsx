import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import "./school-video.css";

export default function SchoolVideoSection() {
  const video = useRef<HTMLVideoElement>(null);
  const pausedByVisitor = useRef(false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [playing, setPlaying] = useState(false);

  // Lecture en boucle seulement quand la vidéo est à l'écran, jamais si les animations sont réduites
  // ni après une pause choisie par le visiteur.
  useEffect(() => {
    const element = video.current;
    if (!element || reduced) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !pausedByVisitor.current) element.play().catch(() => {});
      else element.pause();
    }, { threshold: .35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced]);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    pausedByVisitor.current = !element.paused;
    if (element.paused) element.play().catch(() => {});
    else element.pause();
  };

  return (
    <section id="ecole" className="school-video" aria-labelledby="school-video-title">
      <div className="container school-video-layout">
        <div className="school-video-text">
          <p className="eyebrow">À l’arrivée · L’école</p>
          <h2 id="school-video-title">Équiper pour permettre <em>l’expérimentation.</em></h2>
          <p>En RDC, le matériel rejoint les écoles. Il est installé dans la salle de sciences, puis les élèves s’en servent en séance pratique, avec leur enseignant.</p>
        </div>
        <figure className="school-video-media">
          <video
            ref={video}
            src="/media/parcours/ecole.mp4"
            poster="/media/parcours/ecole.jpg"
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Une équipe installe des microscopes dans une salle de classe, puis des élèves en uniforme les utilisent avec leur enseignant."
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
          <button type="button" className="school-video-toggle" onClick={toggle} aria-label={playing ? "Mettre la vidéo en pause" : "Lire la vidéo"}>
            {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          </button>
          <figcaption>Séquence générée : elle illustre le projet, elle ne montre pas une école équipée par LabCongo.</figcaption>
        </figure>
      </div>
    </section>
  );
}
