import type { EquipmentPurpose } from "../../../types/equipment";
export default function EquipmentIllustration({
  purpose,
}: {
  purpose: EquipmentPurpose;
}) {
  return (
    <svg
      className="equipment-drawing"
      viewBox="0 0 300 240"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="equipment-drawing-grid"
        d="M30 200H270M30 40V210M270 40V210M24 80H36M24 120H36M24 160H36M264 80H276M264 120H276M264 160H276"
      />
      <g
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {purpose === "observer" && (
          <>
            <path d="M80 199H224L214 183H89ZM174 180C228 151 222 88 179 72M173 85C207 108 204 148 166 162M95 137H170M128 145V170H145" />
            <path
              d="m133 55 22-12 39 68-22 12ZM125 45l29-16 10 18-29 16ZM171 128l14-8 9 16-14 8"
              fill="#e3edf9"
            />
            <circle cx="190" cy="131" r="13" fill="var(--brand-yellow)" />
            <path d="m187 126 6 10" />
          </>
        )}
        {purpose === "experimenter" && (
          <>
            <path d="M112 45h76M127 45v62l-48 70q-12 21 12 22h118q24-1 12-22l-48-70V45" />
            <path
              d="m107 142-26 39q-6 10 10 10h118q16 0 10-10l-26-39Z"
              fill="#d6e6f8"
              stroke="none"
            />
            <path d="M116 127h25M108 146h23M95 166h28M165 77h8M165 94h8" />
            <circle
              cx="170"
              cy="169"
              r="7"
              fill="var(--brand-yellow)"
              stroke="none"
            />
            <circle
              cx="155"
              cy="150"
              r="4"
              fill="var(--brand-red)"
              stroke="none"
            />
          </>
        )}
        {purpose === "mesurer" && (
          <>
            <path
              d="M78 158h145l17 39H61ZM145 157V82M104 82h82M92 67h107v15H92Z"
              fill="#e3edf9"
            />
            <path d="m117 67 7-25h43l10 25Z" />
            <rect
              x="112"
              y="171"
              width="56"
              height="15"
              rx="2"
              fill="var(--brand-yellow)"
            />
            <path d="M125 178h5M143 178h13" />
            <circle cx="204" cy="179" r="4" />
          </>
        )}
        {purpose === "organiser" && (
          <>
            <path d="M69 177h162v22H69ZM80 176v-38h140v38M94 138v-70q0-9 9-9t9 9v70M141 138v-85q0-9 9-9t9 9v85M188 138v-70q0-9 9-9t9 9v70" />
            <path
              d="M97 101h12v31H97ZM144 86h12v46h-12Z"
              fill="#d6e6f8"
              stroke="none"
            />
            <path
              d="M191 110h12v22h-12Z"
              fill="var(--brand-yellow)"
              stroke="none"
            />
            <path d="M94 153h18M141 153h18M188 153h18" />
          </>
        )}
      </g>
    </svg>
  );
}
