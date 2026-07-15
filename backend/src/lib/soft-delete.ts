export const SOFT_DELETE_MODELS = new Set([
  "User",
  "Brand",
  "Category",
  "Product",
  "Inventory",
  "ProductImage",
]);

export const ACTIVE_ONLY = { deletedAt: null } as const;

export const isSoftDeleteModel = (model: string) => SOFT_DELETE_MODELS.has(model);

export const withActiveOnly = <T extends Record<string, unknown>>(where?: T) => ({
  ...where,
  deletedAt: null,
});

export const tombstoneUnique = (value: string, id: string) =>
  `${value}__deleted__${id}`;
