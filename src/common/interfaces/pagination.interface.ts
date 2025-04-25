export enum KeysetPaginationDirection {
  forward,
  backward,
}

export interface IKeysetPaginationParams {
  cursor?: string;
  limit?: number;
  direction?: KeysetPaginationDirection;
}

export interface IPaginatedResult<T> {
  data: T[];
  nextCursor?: string;
  prevCursor?: string;
  total: number;
}
