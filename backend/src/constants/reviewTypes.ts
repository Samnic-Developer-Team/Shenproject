export const ReviewType = {
  PRODUCT: 'PRODUCT',
  SERVICE: 'SERVICE',
  SALON: 'SALON',
} as const;

export type ReviewTypeType = (typeof ReviewType)[keyof typeof ReviewType];
