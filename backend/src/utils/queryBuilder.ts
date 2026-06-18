import type { Query, SortOrder } from 'mongoose';
import type { PaginationOptions } from '../interfaces/common.interface';
import { getPagination } from './pagination';

interface SearchableQuery {
  searchTerm?: string;
  filters?: Record<string, unknown>;
}

export const applyQuery = <T>(
  query: Query<T[], T>,
  options: PaginationOptions & SearchableQuery,
  searchableFields: string[] = [],
) => {
  const { skip, limit, sortBy, sortOrder } = getPagination(options);
  const conditions: Record<string, unknown>[] = [];

  if (options.searchTerm && searchableFields.length > 0) {
    conditions.push({
      $or: searchableFields.map(field => ({
        [field]: { $regex: options.searchTerm, $options: 'i' },
      })),
    });
  }

  if (options.filters) {
    conditions.push(options.filters);
  }

  const filter = conditions.length > 0 ? { $and: conditions } : {};

  return query
    .find(filter)
    .sort({ [sortBy]: sortOrder as SortOrder })
    .skip(skip)
    .limit(limit)
    .lean();
};
