import { z } from "zod";
import { site } from "../../config/site";
export const subjects = {
  materiel: "Proposer du matériel",
  ecole: "Présenter une école",
  partenariat: "Devenir partenaire",
  soutien: "Soutenir le projet",
  temoignage: "Partager une expérience",
  autre: "Une autre demande",
} as const;
export type Subject = keyof typeof subjects;
export const normalizeSubject = (value?: string | null): Subject =>
  value && Object.hasOwn(subjects, value) ? (value as Subject) : "autre";
export const messageSchema = z
  .object({
    subject: z.enum([
      "materiel",
      "ecole",
      "partenariat",
      "soutien",
      "temoignage",
      "autre",
    ]),
    name: z
      .string()
      .trim()
      .min(2, "Indiquez votre nom.")
      .max(100, "100 caractères maximum."),
    email: z.email("Indiquez une adresse e-mail valide.").max(200),
    organisation: z.string().trim().max(160, "160 caractères maximum."),
    location: z.string().trim().max(160, "160 caractères maximum."),
    equipment: z.string().trim().max(200, "200 caractères maximum."),
    quantity: z.string().trim().max(80, "80 caractères maximum."),
    condition: z.string().trim().max(200, "200 caractères maximum."),
    message: z
      .string()
      .trim()
      .min(20, "Décrivez votre demande en au moins 20 caractères.")
      .max(3000, "3 000 caractères maximum."),
    consent: z
      .boolean()
      .refine(
        (value) => value,
        "Votre accord est nécessaire pour être recontacté.",
      ),
  })
  .superRefine((data, context) => {
    const requireField = (
      field:
        "organisation" | "location" | "equipment" | "quantity" | "condition",
      message: string,
    ) => {
      if (!data[field])
        context.addIssue({ code: "custom", path: [field], message });
    };
    if (["partenariat", "ecole"].includes(data.subject))
      requireField(
        "organisation",
        data.subject === "ecole"
          ? "Indiquez le nom de l’école."
          : "Indiquez votre organisation.",
      );
    if (["materiel", "ecole"].includes(data.subject))
      requireField("location", "Précisez la ville et le pays.");
    if (data.subject === "materiel") {
      requireField("equipment", "Décrivez le matériel proposé.");
      requireField("quantity", "Indiquez la quantité, même approximative.");
      requireField("condition", "Précisez l’état du matériel.");
    }
  });
export type MessageInput = z.infer<typeof messageSchema>;
export function composeMessage(data: MessageInput) {
  const lines = [
    `Objet : ${subjects[data.subject]}`,
    `Nom : ${data.name}`,
    `E-mail : ${data.email}`,
  ];
  if (data.organisation)
    lines.push(
      `${data.subject === "ecole" ? "École" : "Organisation"} : ${data.organisation}`,
    );
  if (data.location) lines.push(`Localisation : ${data.location}`);
  if (data.subject === "materiel")
    lines.push(
      `Matériel : ${data.equipment}`,
      `Quantité : ${data.quantity}`,
      `État : ${data.condition}`,
    );
  lines.push(
    "",
    data.message,
    "",
    "J’accepte d’être recontacté au sujet de cette demande.",
  );
  const body = lines.join("\n");
  return {
    body,
    href: `mailto:${site.email}?subject=${encodeURIComponent(`LabCongo — ${subjects[data.subject]}`)}&body=${encodeURIComponent(body)}`,
  };
}
