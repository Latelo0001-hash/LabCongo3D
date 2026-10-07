import { lazy, Suspense, useId, useState } from "react";
import { useStore } from "zustand";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { createStoryStore } from "./store";
import { chapterNumber, storyChapters, storyPhases } from "./scenario";
import { useStoryScroll } from "./useStoryScroll";
import StoryViewport from "./StoryViewport";
import StoryControls from "./StoryControls";
import PhotoCredits from "./PhotoCredits";
const StoryMap = lazy(() => import("./StoryMap"));
export default function StoryExperience() {
  const [store] = useState(createStoryStore);
  const index = useStore(store, (state) => Math.floor(state.progress));
  const chapter = storyChapters[index];
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wide = useMediaQuery("(min-width: 1000px) and (min-height: 680px)");
  const [staticSelected, setStaticSelected] = useState(false);
  const [manual, setManual] = useState(false);
  const staticMode = staticSelected || reduced;
  const scrollMode = wide && !staticMode && !manual;
  const { ref, seek } = useStoryScroll(store, scrollMode);
  const id = useId();
  return (
    <>
      <div
        id="voyage-immersif"
        ref={ref}
        className={`story-track ${scrollMode ? "story-scroll" : "story-manual"}`}
        data-scroll-mode={scrollMode}
        style={
          scrollMode
            ? { height: `${storyChapters.length * 70 + 100}svh` }
            : undefined
        }
      >
        <div className="story-shell">
          <div className="story-toolbar">
            <div>
              <span className="story-eyebrow">Le voyage du matériel</span>
              <p>
                {scrollMode
                  ? "Faites défiler pour avancer"
                  : "Choisissez une scène ou utilisez le curseur"}
              </p>
            </div>
            <div className="story-display-options">
              {wide && !staticMode && (
                <button
                  type="button"
                  aria-pressed={manual}
                  onClick={() => setManual((value) => !value)}
                >
                  {manual ? "Activer le défilement" : "Navigation manuelle"}
                </button>
              )}
              <button
                type="button"
                disabled={reduced}
                aria-pressed={staticMode}
                onClick={() => setStaticSelected((value) => !value)}
              >
                {reduced ? "Animations réduites" : "Version sans animation"}
              </button>
              <a href="#recit-complet" className="story-skip">
                Lire le récit <ArrowDown size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="story-stage">
            <div className="story-visual">
              <StoryViewport store={store} staticMode={staticMode} />
              {index === 5 && (
                <div
                  className="story-route-label"
                  aria-label="Trajet schématique : Europe vers Afrique puis République démocratique du Congo"
                >
                  <span>Europe</span>
                  <span aria-hidden="true">→</span>
                  <span>Afrique</span>
                  <span aria-hidden="true">→</span>
                  <strong>RDC</strong>
                </div>
              )}
              {index === 7 && (
                <Suspense fallback={null}>
                  <StoryMap />
                </Suspense>
              )}
            </div>
            <article
              className="story-caption"
              aria-labelledby={`${id}-title`}
              data-lenis-prevent
            >
              <p className="story-phase">
                {chapter.phase}
                <span>Scène {chapterNumber(index)}</span>
              </p>
              <p className="story-location">{chapter.location}</p>
              <h2 id={`${id}-title`} tabIndex={-1}>
                {chapter.title}
              </h2>
              <p className="story-description">{chapter.description}</p>
              {chapter.message && (
                <p className="story-message">{chapter.message}</p>
              )}
              <ol className="story-actions">
                {chapter.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ol>
              {index === 11 && (
                <>
                  <img
                    className="story-signature"
                    src="/images/brand/logo-color.png"
                    width="800"
                    height="382"
                    alt="LabCongo"
                  />
                  <Link className="button" to="/faire-un-don">
                    Prendre part au voyage <ArrowUpRight size={16} />
                  </Link>
                </>
              )}
            </article>
          </div>
          <StoryControls store={store} seek={seek} />
          <div className="story-chapter-select">
            <label htmlFor={`${id}-chapter`}>Aller à une scène</label>
            <select
              id={`${id}-chapter`}
              value={index}
              onChange={(event) => seek(Number(event.target.value) + 0.15)}
            >
              {storyChapters.map((item, i) => (
                <option key={item.id} value={i}>
                  {chapterNumber(i)} · {item.title}
                </option>
              ))}
            </select>
            <p>
              {storyPhases.map((phase) => (
                <span
                  key={phase}
                  aria-current={phase === chapter.phase ? "step" : undefined}
                >
                  {phase}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
      <section
        id="recit-complet"
        className="story-transcript container"
        aria-labelledby="story-transcript-title"
      >
        <p className="eyebrow">Le parcours en douze scènes</p>
        <h2 id="story-transcript-title">Une seconde vie, étape après étape.</h2>
        <p>
          Ces photographies d’illustration accompagnent le parcours prévu du
          matériel. Elles ne documentent pas des interventions de LabCongo. Les
          reportages du projet viendront les remplacer au fil des activités
          documentées.
        </p>
        <ol>
          {storyChapters.map((item, i) => (
            <li key={item.id}>
              <span className="story-transcript-number">
                {chapterNumber(i)}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.message && <blockquote>{item.message}</blockquote>}
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    seek(i + 0.15);
                    if (!scrollMode)
                      ref.current?.scrollIntoView({
                        block: "start",
                        behavior: "instant",
                      });
                    requestAnimationFrame(() =>
                      document
                        .getElementById(`${id}-title`)
                        ?.focus({ preventScroll: true }),
                    );
                  }}
                >
                  Voir la scène {chapterNumber(i)} ↗
                </button>
              </div>
            </li>
          ))}
        </ol>
        <Link className="button" to="/notre-demarche">
          Découvrir la démarche de LabCongo ↗
        </Link>
      </section>
      <PhotoCredits />
    </>
  );
}
