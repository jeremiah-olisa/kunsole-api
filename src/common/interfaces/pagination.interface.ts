
export interface IKeysetPaginationParams {
    cursor?: string;
    limit?: number;
    direction?: 'forward' | 'backward';
}

export interface IPaginatedResult<T> {
    data: T[];
    nextCursor?: string;
    prevCursor?: string;
    total: number;
}


