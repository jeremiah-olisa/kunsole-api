export interface KeysetPaginationParams {
    cursor?: string;
    limit?: number;
    direction?: 'forward' | 'backward';
}

export interface PaginatedResult<T> {
    data: T[];
    nextCursor?: string;
    prevCursor?: string;
    total: number;
}
