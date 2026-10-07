const baseURL = import.meta.env.VITE_API_BASE_URL;
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  if (!baseURL) throw new Error("L’API LabCongo n’est pas encore configurée.");
  const response = await fetch(
    `${baseURL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
    init,
  );
  if (!response.ok) throw new Error(`Erreur API : ${response.status}`);
  return response.json() as Promise<T>;
}
