import { ArrowDown, ArrowUpRight } from "lucide-react";
import Button from "../../../components/common/Button";
import { useHeroAnimation } from "../../../hooks/useHeroAnimation";
import { PhotoImage } from "../../../components/common/Photo";
import { narrativePhotos } from "../../../features/experience/photos";
export default function HeroSection() {
  const ref = useHeroAnimation();
  return (
    <section
      ref={ref}
      className="hero container"
      aria-labelledby="hero-title"
      data-scene-scroll
    >
      <div className="hero-topline">
        <span>SCIENCE · ÉDUCATION · TRANSMISSION</span>
        <span className="hero-location">Belgique / France → RDC</span>
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <div>
            <p className="eyebrow">
              <span className="dot" /> De l’équipement à la connaissance
            </p>
            <h1 id="hero-title">
              <span className="hero-line-mask">
                <span className="hero-line">La science</span>
              </span>
              <span className="hero-line-mask">
                <span className="hero-line">s’apprend aussi</span>
              </span>
              <span className="hero-line-mask">
                <em className="hero-line">avec les mains.</em>
              </span>
            </h1>
            <p className="hero-description">
              Nous collectons du matériel scientifique en Belgique et en France
              pour accompagner les écoles de RDC, de la théorie à la pratique.
            </p>
            <div className="hero-actions">
              <Button to="/experience">
                Suivre le voyage <ArrowUpRight size={18} />
              </Button>
              <Button to="/faire-un-don" secondary>
                Donner du matériel
              </Button>
            </div>
          </div>
          <a href="#presentation" className="scroll-cue">
            <ArrowDown size={17} /> Explorer le projet
          </a>
        </div>
        <div className="hero-visual">
          <span className="hero-photo-label">
            L’apprentissage par l’expérience
          </span>
          <div className="hero-photo-frame">
            <PhotoImage
              photo={narrativePhotos.pratique}
              className="hero-photo"
              priority
            />
          </div>
          <div className="photo-caption">
            <span>
              Le savoir prend vie
              <br />
              au contact du réel.
            </span>
            <a href="/experience#credits-photos">
              Photo d’illustration · Crédits ↗
            </a>
          </div>
          <div className="instrument-card">
            <span className="eyebrow">Une seconde vie</span>
            <PhotoImage
              photo={narrativePhotos.instruments}
              className="instrument-photo"
              sizes="245px"
            />
            <div className="instrument-caption">
              <span>Observer de plus près</span>
              <span>EN LABORATOIRE</span>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-bottom">
        <span>
          Une seconde vie pour le matériel.
          <br />
          Un nouvel horizon pour les élèves.
        </span>
        <ol>
          <li>
            <b>01</b> Collecter
          </li>
          <li>
            <b>02</b> Préparer
          </li>
          <li>
            <b>03</b> Acheminer
          </li>
          <li>
            <b>04</b> Équiper
          </li>
          <li>
            <b>05</b> Former
          </li>
        </ol>
      </div>
    </section>
  );
}
