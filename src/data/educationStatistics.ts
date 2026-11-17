// Enseignement secondaire, année scolaire 2023-2024, par province.
// Source : Annuaire statistique de l’enseignement préscolaire, primaire et secondaire 2023-2024,
// MINEDU-NC / DIGE, juin 2026 (tableaux 1, 85, 86 et 121). Seules les écoles ayant répondu au
// recensement sont comptées : les effectifs sont des minimums. Les totaux des 26 provinces
// correspondent aux totaux nationaux de l’annuaire.
export const educationSource = {
  title: "Annuaire statistique 2023-2024",
  publisher: "MINEDU-NC / DIGE",
  url: "https://edu-nc.gouv.cd/documentation/annuaire-statistique-de-lenseignement-prescolaire-primaire-et-secondaire-pour-lannee-scolaire-2023-2024",
} as const;

export interface SecondaryStats {
  /** Écoles secondaires ayant répondu au recensement. */
  schools: number;
  /** Part des écoles existantes ayant répondu au recensement, en %. */
  coverage: number;
  pupils: number;
  teachers: number;
  /** Part des écoles disposant de l’électricité, en %. */
  electricity: number;
  /** Part des écoles disposant d’un point d’eau, en %. */
  water: number;
  /** Taux d’achèvement du secondaire (humanités), en %. */
  completion: number;
  girlsCompletion: number;
}

export const secondaryStatsByProvince: Readonly<Record<string, SecondaryStats>> = {
  "CD-KN": { schools: 4034, coverage: 96.97, pupils: 956155, teachers: 67452, electricity: 69.6, water: 75.7, completion: 53, girlsCompletion: 62.7 },
  "CD-BC": { schools: 2156, coverage: 91.98, pupils: 402042, teachers: 32964, electricity: 27.5, water: 54.2, completion: 30.2, girlsCompletion: 28.3 },
  "CD-KG": { schools: 1934, coverage: 96.31, pupils: 187227, teachers: 28388, electricity: 1.2, water: 57.9, completion: 38.5, girlsCompletion: 33.5 },
  "CD-KL": { schools: 4058, coverage: 97.17, pupils: 557283, teachers: 96090, electricity: 1.1, water: 46.2, completion: 49, girlsCompletion: 47.7 },
  "CD-MN": { schools: 1433, coverage: 90.07, pupils: 185634, teachers: 16238, electricity: 0.8, water: 34.2, completion: 42, girlsCompletion: 33.6 },
  "CD-EQ": { schools: 1209, coverage: 90.36, pupils: 177335, teachers: 17498, electricity: 1.6, water: 32, completion: 42.1, girlsCompletion: 28.4 },
  "CD-TU": { schools: 906, coverage: 87.03, pupils: 129171, teachers: 9340, electricity: 1.2, water: 58.3, completion: 26.9, girlsCompletion: 16 },
  "CD-MO": { schools: 1042, coverage: 99.05, pupils: 172621, teachers: 13280, electricity: 1.5, water: 41.3, completion: 29.1, girlsCompletion: 15.4 },
  "CD-SU": { schools: 1604, coverage: 82, pupils: 383819, teachers: 21782, electricity: 1, water: 55.1, completion: 43, girlsCompletion: 32.9 },
  "CD-NU": { schools: 958, coverage: 93.74, pupils: 140041, teachers: 14932, electricity: 3.1, water: 14.7, completion: 34, girlsCompletion: 21.3 },
  "CD-TO": { schools: 1572, coverage: 83.93, pupils: 203801, teachers: 18362, electricity: 6.9, water: 34.7, completion: 30.9, girlsCompletion: 19.8 },
  "CD-IT": { schools: 1271, coverage: 82.96, pupils: 234742, teachers: 16886, electricity: 6.1, water: 31.9, completion: 20.9, girlsCompletion: 19.6 },
  "CD-HU": { schools: 712, coverage: 94.93, pupils: 113432, teachers: 9689, electricity: 4.6, water: 39.1, completion: 16.6, girlsCompletion: 13.2 },
  "CD-BU": { schools: 548, coverage: 98.03, pupils: 64577, teachers: 4901, electricity: 1.8, water: 29.8, completion: 12.5, girlsCompletion: 10.9 },
  "CD-NK": { schools: 2474, coverage: 85.05, pupils: 453393, teachers: 39946, electricity: 6.5, water: 39.8, completion: 26.4, girlsCompletion: 23.5 },
  "CD-SK": { schools: 2753, coverage: 90.09, pupils: 567356, teachers: 35017, electricity: 6.7, water: 37.4, completion: 31.8, girlsCompletion: 27.7 },
  "CD-MA": { schools: 1303, coverage: 93, pupils: 170137, teachers: 15976, electricity: 1.8, water: 9.7, completion: 28, girlsCompletion: 20.3 },
  "CD-KC": { schools: 2067, coverage: 99.52, pupils: 438101, teachers: 28597, electricity: 1.7, water: 5, completion: 52.7, girlsCompletion: 32.9 },
  "CD-KS": { schools: 2299, coverage: 99.91, pupils: 373227, teachers: 42499, electricity: 2.4, water: 11.1, completion: 56, girlsCompletion: 32.3 },
  "CD-KE": { schools: 758, coverage: 98.7, pupils: 176463, teachers: 10560, electricity: 4.1, water: 12.9, completion: 29.9, girlsCompletion: 15.4 },
  "CD-SA": { schools: 1311, coverage: 98.79, pupils: 207928, teachers: 16505, electricity: 1.5, water: 19, completion: 38, girlsCompletion: 30.7 },
  "CD-LO": { schools: 1615, coverage: 80.55, pupils: 305044, teachers: 17403, electricity: 0.9, water: 59, completion: 40.9, girlsCompletion: 28.5 },
  "CD-HK": { schools: 2226, coverage: 80.71, pupils: 438909, teachers: 24954, electricity: 54.1, water: 77.3, completion: 44.1, girlsCompletion: 40.9 },
  "CD-LU": { schools: 872, coverage: 93.76, pupils: 153132, teachers: 10585, electricity: 22.5, water: 40.4, completion: 19, girlsCompletion: 16 },
  "CD-TA": { schools: 1098, coverage: 87.42, pupils: 197747, teachers: 12020, electricity: 6.1, water: 16.6, completion: 21.3, girlsCompletion: 13.8 },
  "CD-HL": { schools: 1322, coverage: 90.98, pupils: 257112, teachers: 13599, electricity: 4.5, water: 17.8, completion: 28.4, girlsCompletion: 17.3 },
};

// Valeurs publiées pour l’ensemble de la RDC (tableaux 1, 85, 86 et 121).
export const nationalSecondaryStats: SecondaryStats = {
  schools: 43535, coverage: 91.38, pupils: 7646429, teachers: 635463,
  electricity: 12.6, water: 40.5, completion: 36.1, girlsCompletion: 30.7,
};

/** Provinces où l’exploitation minière est la plus importante (choix éditorial de LabCongo). */
export const miningProvinceCodes: readonly string[] = [
  "CD-HK", "CD-LU", "CD-HL", "CD-TA", "CD-NK", "CD-SK",
  "CD-MA", "CD-IT", "CD-HU", "CD-KS", "CD-KC", "CD-KE",
];

export const isMiningProvince = (code?: string | null) =>
  Boolean(code && miningProvinceCodes.includes(code));

const copperBelt = ["CD-HK", "CD-LU"];
const miningStats = miningProvinceCodes.map((code) => secondaryStatsByProvince[code]);
const miningPupils = miningStats.reduce((total, stats) => total + stats.pupils, 0);

export const miningSummary = {
  provinces: miningProvinceCodes.length,
  pupils: miningPupils,
  pupilsShare: miningPupils / nationalSecondaryStats.pupils,
  /** Hors Haut-Katanga et Lualaba : part maximale d’écoles disposant de l’électricité. */
  maxElectricityElsewhere: Math.max(
    ...miningProvinceCodes
      .filter((code) => !copperBelt.includes(code))
      .map((code) => secondaryStatsByProvince[code].electricity),
  ),
  provincesElsewhere: miningProvinceCodes.length - copperBelt.length,
};
