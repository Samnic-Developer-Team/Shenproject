export const Roles = {
  ADMIN: 'ADMIN',
  SELLER: 'SELLER',
  USER: 'USER',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

