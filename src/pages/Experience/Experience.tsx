import { Helmet } from "react-helmet-async";
import StoryExperience from "../../features/experience/StoryExperience";
export default function Experience() {
  return (
    <>
      <Helmet>
        <title>Le voyage du matériel — L’expérience LabCongo</title>
        <meta
          name="description"
          content="Suivez le voyage du matériel scientifique en douze scènes : du laboratoire européen à une séance pratique dans une école de RDC."
        />
      </Helmet>
      <header className="story-intro container">
        <div>
          <p className="eyebrow">Europe → RDC · Un voyage à transmettre</p>
          <h1>
            Un instrument.
            <br />
            <em>De nouvelles possibilités.</em>
          </h1>
          <p>
            De la rencontre dans un laboratoire aux premiers gestes en classe,
            suivez le parcours du matériel scientifique en douze scènes.
          </p>
          <a href="#voyage-immersif" className="button">
            Entrer dans le voyage ↓
          </a>
        </div>
      </header>
      <StoryExperience />
    </>
  );
}
