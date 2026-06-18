import type { PaginationOptions } from '../interfaces/common.interface';

export const getPagination = (options: PaginationOptions) => {
  const page = Math.max(Number(options.page ?? 1), 1);
  const limit = Math.max(Number(options.limit ?? 10), 1);
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy ?? 'createdAt';
  const sortOrder = options.sortOrder === 'asc' ? 1 : -1;

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
