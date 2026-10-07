import { equipment } from "../../../data/equipment";
import type { EquipmentPurpose } from "../../../types/equipment";
export const equipmentPurposes: Record<EquipmentPurpose, string> = {
  observer: "Observer",
  experimenter: "Expérimenter",
  mesurer: "Mesurer",
  organiser: "Organiser",
};
export function getEquipment(purpose?: string) {
  return equipment.filter((item) => !purpose || item.purpose === purpose);
}
export function findEquipment(slug: string | undefined) {
  return equipment.find((item) => item.slug === slug);
}
