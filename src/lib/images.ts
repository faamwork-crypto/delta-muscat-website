/**
 * Central image map.
 *
 * Photography: official imagery sourced from the company's own demo site
 * (stored in /public/images/photos). Generated SVG illustrations remain as
 * honest placeholders only where no real photo exists for that topic
 * (currently parking shades, sectors and gallery concepts).
 */

export const solutionImages: Record<string, string> = {
  pergolas: "/images/photos/pergola-pool.webp",
  "parking-shades": "/images/solutions/parking-shades.svg", // placeholder until real photography
  "shade-structures": "/images/photos/shade-sail.webp",
  "metal-decoration": "/images/photos/entrance-night.webp",
};

export const sectorImages: Record<string, string> = {
  "luxury-villas": "/images/sectors/luxury-villas.svg",
  hospitality: "/images/sectors/hospitality.svg",
  commercial: "/images/sectors/commercial.svg",
  government: "/images/sectors/government.svg",
  architects: "/images/sectors/architects.svg",
};

export const materialImages = [
  "/images/photos/profile-samples.webp",
  "/images/materials/steel.svg",
  "/images/photos/fabric-samples.webp",
  "/images/photos/color-samples.webp",
  "/images/photos/hardware-samples.webp",
];

export const images = {
  hero: "/images/photos/pergola-villa.webp",
  factory: "/images/photos/factory-facade.webp",
  showroom: "/images/photos/showroom-office.webp",
  sampleBox: "/images/photos/sample-box.webp",
  cta: "/images/cta/cta-dusk.svg",
};
