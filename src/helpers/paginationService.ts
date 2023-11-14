type Pagination = { skip: number; take: number };

export function paginationService(page: number, limit: number): Pagination {
  const skip = (page - 1) * limit;
  const take = limit;

  return { skip, take };
}
