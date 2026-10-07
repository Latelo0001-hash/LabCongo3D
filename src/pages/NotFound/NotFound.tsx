import UnavailableContent from "../../components/common/UnavailableContent";
export default function NotFound() {
  return (
    <UnavailableContent
      title="Cette page est introuvable."
      to="/"
      label="Revenir à l’accueil"
    />
  );
}
