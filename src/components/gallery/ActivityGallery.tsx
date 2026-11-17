import Gallery from "./Gallery";
import { getActivityPhotos } from "../../services/activityPhotos";
import { activityIllustrations } from "../../data/activityIllustrations";

export default function ActivityGallery() {
  const images = getActivityPhotos();
  if (!images.length && !activityIllustrations.length) return null;
  return <section id="activites-en-images" className="activities-section activities-photo-section" aria-labelledby="activities-photos-title">
    <p className="eyebrow">Les gestes du projet</p>
    <h2 id="activities-photos-title">Les activités en images.</h2>
    {images.length > 0 && <><p className="activities-lead">Les moments documentés des actions de LabCongo et de son équipe.</p><Gallery images={images} /></>}
    {activityIllustrations.length > 0 && <div className="activities-illustrations">
      <p className="activities-illustration-note">Mises en situation générées pour illustrer la collecte, la préparation et les usages du matériel. Ces images ne documentent pas des interventions réalisées.</p>
      <Gallery images={activityIllustrations} />
    </div>}
  </section>;
}
