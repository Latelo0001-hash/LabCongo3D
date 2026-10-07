export type EquipmentPurpose =
  "observer" | "experimenter" | "mesurer" | "organiser";
export interface Equipment {
  id: string;
  slug: string;
  name: string;
  purpose: EquipmentPurpose;
  summary: string;
  description: string;
  examples: string[];
  uses: string[];
  donationDetails: string[];
}
