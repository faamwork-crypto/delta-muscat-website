/**
 * Central image map.
 *
 * Photography: official imagery sourced from the company's own demo site
 * (stored in /public/images/photos). Generated SVG illustrations remain as
 * honest placeholders only where no real photo exists for that topic
 * (currently parking shades, sectors and gallery concepts).
 *
 * All paths are prefixed with BASE so raw <img> tags also work on GitHub
 * Pages deployments (base path "/delta-muscat-website").
 */

const withBase = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p}`;

export const solutionImages: Record<string, string> = {
  pergolas: withBase("/images/photos/pergola-pool.webp"),
  "parking-shades": withBase("/images/solutions/parking-shades.svg"), // placeholder until real photography
  "shade-structures": withBase("/images/photos/shade-sail.webp"),
  "metal-decoration": withBase("/images/photos/entrance-night.webp"),
};

export const sectorImages: Record<string, string> = {
  "luxury-villas": withBase("/images/sectors/luxury-villas.svg"),
  hospitality: withBase("/images/sectors/hospitality.svg"),
  commercial: withBase("/images/sectors/commercial.svg"),
  government: withBase("/images/sectors/government.svg"),
  architects: withBase("/images/sectors/architects.svg"),
};

export const materialImages = [
  withBase("/images/photos/profile-samples.webp"),
  withBase("/images/materials/steel.svg"),
  withBase("/images/photos/fabric-samples.webp"),
  withBase("/images/photos/color-samples.webp"),
  withBase("/images/photos/hardware-samples.webp"),
];

export const images = {
  hero: withBase("/images/photos/pergola-villa.webp"),
  factory: withBase("/images/photos/factory-facade.webp"),
  showroom: withBase("/images/photos/showroom-office.webp"),
  sampleBox: withBase("/images/photos/sample-box.webp"),
  cta: withBase("/images/cta/cta-dusk.svg"),
  solutionsPergolas: withBase("/images/solutions/pergolas.svg"),
  sectorsCommercial: withBase("/images/sectors/commercial.svg"),
  materialsFinishes: withBase("/images/materials/finishes.svg"),
  galleryConcept2: withBase("/images/gallery/concept-02.svg"),
};
