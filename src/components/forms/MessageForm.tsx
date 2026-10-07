import { useId, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Mail } from "lucide-react";
import {
  composeMessage,
  messageSchema,
  subjects,
} from "../../features/contact/message";
import type { MessageInput, Subject } from "../../features/contact/message";
import { site } from "../../config/site";
export default function MessageForm({
  subject = "autre",
  locked = false,
}: {
  subject?: Subject;
  locked?: boolean;
}) {
  const id = useId();
  const result = useRef<HTMLElement>(null);
  const [prepared, setPrepared] = useState<ReturnType<
    typeof composeMessage
  > | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      subject,
      name: "",
      email: "",
      organisation: "",
      location: "",
      equipment: "",
      quantity: "",
      condition: "",
      message: "",
      consent: false,
    },
  });
  const selected = useWatch({ control, name: "subject" });
  const field = (
    name:
      | "name"
      | "email"
      | "organisation"
      | "location"
      | "equipment"
      | "quantity"
      | "condition",
    label: string,
    required = false,
    hint?: string,
  ) => (
    <div className="form-field">
      <label htmlFor={`${id}-${name}`}>
        {label}
        {required ? " *" : " (facultatif)"}
      </label>
      <input
        id={`${id}-${name}`}
        type={name === "email" ? "email" : "text"}
        autoComplete={
          name === "name"
            ? "name"
            : name === "email"
              ? "email"
              : name === "organisation"
                ? "organization"
                : "off"
        }
        aria-required={required}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={
          errors[name]
            ? `${id}-${name}-error`
            : hint
              ? `${id}-${name}-hint`
              : undefined
        }
        {...register(name)}
      />
      {hint && <small id={`${id}-${name}-hint`}>{hint}</small>}
      {errors[name] && (
        <p className="field-error" id={`${id}-${name}-error`}>
          {errors[name]?.message}
        </p>
      )}
    </div>
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(prepared?.body ?? "");
      setCopyStatus(
        "Message copié. Vous pouvez le coller dans votre messagerie.",
      );
    } catch {
      setCopyStatus(
        "La copie automatique est indisponible. Sélectionnez le texte du brouillon ci-dessous pour le copier.",
      );
    }
  }
  function prepare(data: MessageInput) {
    setPrepared(composeMessage(data));
    setCopyStatus("");
    requestAnimationFrame(() => {
      result.current?.focus();
      result.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
    });
  }
  return (
    <div className="message-form-wrapper">
      <form
        className="message-form"
        onSubmit={(event) => {
          void handleSubmit(prepare)(event);
        }}
        noValidate
        onChange={() => {
          if (prepared) setPrepared(null);
        }}
      >
        <p className="form-intro">
          Ce formulaire prépare un e-mail dans votre messagerie. Rien n’est
          envoyé automatiquement. Les champs marqués * sont nécessaires.
        </p>
        {locked ? (
          <>
            <input type="hidden" {...register("subject")} />
            <p className="form-subject">{subjects[selected]}</p>
          </>
        ) : (
          <div className="form-field">
            <label htmlFor={`${id}-subject`}>Votre demande *</label>
            <select id={`${id}-subject`} {...register("subject")}>
              {Object.entries(subjects).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="form-row">
          {field("name", "Votre nom", true)}
          {field("email", "Votre e-mail", true)}
        </div>
        {field(
          "organisation",
          selected === "ecole" ? "Nom de l’école" : "Organisation",
          ["ecole", "partenariat"].includes(selected),
        )}
        {field(
          "location",
          "Ville et pays",
          ["ecole", "materiel"].includes(selected),
        )}
        {selected === "materiel" && (
          <fieldset className="material-fields">
            <legend>Votre proposition de matériel</legend>
            {field("equipment", "Nature et référence du matériel", true)}
            <div className="form-row">
              {field("quantity", "Quantité", true)}
              {field("condition", "État de fonctionnement", true)}
            </div>
            <p>
              Vous pourrez joindre des photos et des documents directement à
              votre e-mail avant de l’envoyer.
            </p>
          </fieldset>
        )}
        <div className="form-field">
          <label htmlFor={`${id}-message`}>
            {selected === "ecole"
              ? "Besoins, niveaux scolaires et espace disponible"
              : "Votre message"}{" "}
            *
          </label>
          <textarea
            id={`${id}-message`}
            rows={6}
            maxLength={3000}
            aria-required="true"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={`${id}-message-hint${errors.message ? ` ${id}-message-error` : ""}`}
            {...register("message")}
          />
          <small id={`${id}-message-hint`}>
            Entre 20 et 3 000 caractères. Évitez les données personnelles
            d’élèves.
          </small>
          {errors.message && (
            <p className="field-error" id={`${id}-message-error`}>
              {errors.message.message}
            </p>
          )}
        </div>
        <div className="form-consent">
          <input
            type="checkbox"
            id={`${id}-consent`}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={
              errors.consent ? `${id}-consent-error` : undefined
            }
            {...register("consent")}
          />
          <label htmlFor={`${id}-consent`}>
            J’accepte que LabCongo me recontacte au sujet de cette demande. *
          </label>
        </div>
        {errors.consent && (
          <p className="field-error" id={`${id}-consent-error`}>
            {errors.consent.message}
          </p>
        )}
        {Object.keys(errors).length > 0 && (
          <p className="form-error-summary" role="alert">
            Vérifiez les champs indiqués avant de préparer votre message.
          </p>
        )}
        <button type="submit" className="button">
          Préparer mon e-mail <Mail size={17} aria-hidden="true" />
        </button>
        <p className="form-privacy">
          Votre saisie reste dans cette page jusqu’à l’ouverture de votre
          messagerie. Elle n’est pas enregistrée sur le site.
        </p>
      </form>
      {prepared && (
        <section
          ref={result}
          tabIndex={-1}
          className="message-preview"
          aria-labelledby={`${id}-preview-title`}
        >
          <p className="eyebrow">Brouillon prêt · pas encore envoyé</p>
          <h3 id={`${id}-preview-title`}>
            Relisez, puis envoyez depuis votre messagerie.
          </h3>
          <p>
            Destinataire : <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <label htmlFor={`${id}-preview`}>Votre message préparé</label>
          <textarea
            id={`${id}-preview`}
            value={prepared.body}
            readOnly
            rows={10}
          />
          <div className="preview-actions">
            <a className="button" href={prepared.href}>
              Ouvrir ma messagerie ↗
            </a>
            <button
              className="button button-secondary"
              type="button"
              onClick={copy}
            >
              <Copy size={16} aria-hidden="true" />
              Copier le message
            </button>
          </div>
          <p className="form-privacy">
            Si votre messagerie ne s’ouvre pas, copiez le message et envoyez-le
            à {site.email}. Vérifiez votre adresse d’expédition et ajoutez vos
            pièces jointes avant l’envoi.
          </p>
          <p role="status">{copyStatus}</p>
        </section>
      )}
    </div>
  );
}
