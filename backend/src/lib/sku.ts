// Conceptual — not in your repo yet
type SkuInput = {
  brandCode?: string;   // e.g. first 3 letters of brand slug
  categoryCode?: string;
  sequence?: number;
};

function generateSku(input?: SkuInput): string {
  if (input?.brandCode && input?.categoryCode && input?.sequence != null) {
    return `${input.brandCode}-${input.categoryCode}-${String(input.sequence).padStart(4, "0")}`.toUpperCase();
  }
  return `SKU-${crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;
}

export default generateSku;