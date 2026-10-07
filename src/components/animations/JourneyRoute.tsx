export default function JourneyRoute() {
  return (
    <div className="journey-route" aria-hidden="true">
      <svg viewBox="0 0 460 530" fill="none" focusable="false">
        <defs>
          <pattern
            id="journey-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.14" />
          </pattern>
        </defs>
        <rect width="460" height="530" fill="url(#journey-grid)" />
        <path
          className="journey-track"
          d="M110 100 C400 100 25 300 230 330 S395 340 355 455"
        />
        <path
          className="journey-trace"
          d="M110 100 C400 100 25 300 230 330 S395 340 355 455"
        />
        <circle cx="110" cy="100" r="22" className="journey-halo" />
        <circle cx="110" cy="100" r="6" className="journey-point" />
        <text x="110" y="47" className="journey-svg-heading">
          EUROPE
        </text>
        <text x="110" y="66" className="journey-svg-caption">
          Belgique · France
        </text>
        <circle cx="230" cy="330" r="6" className="journey-point" />
        <text x="270" y="285" className="journey-svg-heading">
          RDC
        </text>
        <text x="270" y="305" className="journey-svg-caption">
          Réception du matériel
        </text>
        <circle cx="355" cy="455" r="22" className="journey-halo" />
        <circle cx="355" cy="455" r="6" className="journey-point" />
        <text x="200" y="453" className="journey-svg-heading">
          L’ÉCOLE
        </text>
        <text x="200" y="474" className="journey-svg-caption">
          La pratique commence
        </text>
        <g
          className="journey-parcel"
          transform="translate(110 100)"
          opacity="0"
        >
          <circle r="20" fill="var(--brand-yellow)" />
          <path
            d="M-8 -5 0 -9 8 -5 8 5 0 9 -8 5Z M-8 -5 0 -1 8 -5 M0 -1V9 M-4 -7 4 -3"
            stroke="var(--ink)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
      </svg>
      <div className="journey-route-caption">
        <span>Europe → RDC → École</span>
        <span>Parcours schématique</span>
      </div>
    </div>
  );
}
