import { z } from "zod";
import { provinces } from "../data/provinces";
const shapeSchema = z.array(
  z.object({ code: z.string(), path: z.string().min(1) }),
);
export async function getProvinceShapes(signal?: AbortSignal) {
  const response = await fetch("/maps/rdc-provinces.json", { signal });
  if (!response.ok) throw new Error("Le fond de carte n’a pas pu être chargé.");
  const shapes = shapeSchema.parse(await response.json());
  const codes = new Set(shapes.map((shape) => shape.code));
  if (
    shapes.length !== provinces.length ||
    codes.size !== provinces.length ||
    provinces.some((province) => !codes.has(province.code))
  ) {
    throw new Error("Le fond de carte est incomplet.");
  }
  return shapes;
}
