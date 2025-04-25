import { Prisma, PrismaClient } from '@prisma/client';

export type PrismaClientTransaction = Prisma.TransactionClient;

export type DataType = 'string' | 'number' | 'array' | 'object' | 'bigint' | 'date' | 'boolean'


export type FilterStartsWith<
  Set,
  Needle extends string,
> = Set extends `${Needle}${infer _X}` ? Set : never;

export type FilteredPrismaKeys = FilterStartsWith<keyof PrismaClient, '$'>;

export type TableNames = keyof Omit<PrismaClient, FilteredPrismaKeys>;

export type TableColumns<Table> = keyof Table;
