import { Prisma } from '@prisma/client';

export const PRISMA_ERRORS = {
  P1000:
    'Authentication failed against database server at {database_host}, the provided database credentials for {database_user} are not valid. Please make sure to provide valid database credentials for the database server at {database_host}.',
  P1001:
    "Can't reach database server at {database_host}:{database_port} Please make sure your database server is running at {database_host}:{database_port}.",
  P1002:
    'The database server at {database_host}:{database_port} was reached but timed out. Please try again. Please make sure your database server is running at {database_host}:{database_port}. ',
  P1003: 'Database {database_file_name} does not exist at {database_file_path}',
  P1008: 'Operations timed out after {time}',
  P1009:
    'Database {database_name} already exists on the database server at {database_host}:{database_port}',
  P1010:
    'User {database_user} was denied access on the database {database_name}',
  P1011: 'Error opening a TLS connection: {message}',
  P1013: 'The provided database string is invalid. {details}',
  P1014: 'The underlying {kind} for model {model} does not exist.',
  P1015:
    'Your Prisma schema is using features that are not supported for the version of the database. \nDatabase version: {database_version} \nErrors: {errors}',
  P1016:
    'Your raw query had an incorrect number of parameters. Expected: {expected}, actual: {actual}.',
  P1017: 'Server has closed the connection.',

  P2001:
    'The record searched for in the where condition ({model_name}.{argument_name} = {argument_value}) does not exist',
  P2002: 'Unique constraint failed on the {cause}',
  P2003: 'Foreign key constraint failed on the field: {field_name}',
  P2004: 'A constraint failed on the database: {database_error}',
  P2005:
    "The value {field_value} stored in the database for the field {field_name} is invalid for the field's type",
  P2006:
    'The provided value {field_value} for {model_name} field {field_name} is not valid',
  P2007: 'Data validation error {database_error}',
  P2008: 'Failed to parse the query {query_parsing_error} at {query_position}',
  P2009:
    'Failed to validate the query: {query_validation_error} at {query_position}',
  P2010: 'Raw query failed. Code: {code}. Message: {message}',
  P2011: 'Null constraint violation on the {constraint}',
  P2012: 'Missing a required value at {path}',
  P2013:
    'Missing the required argument {argument_name} for field {field_name} on {object_name}.',
  P2014:
    "The change you are trying to make would violate the required relation '{relation_name}' between the {model_a_name} and {model_b_name} models.",
  P2015: 'A related record could not be found. {details}',
  P2016: 'Query interpretation error. {details}',
  P2017:
    'The records for relation {relation_name} between the {parent_name} and {child_name} models are not connected.',
  P2018: 'The required connected records were not found. {details}',
  P2019: 'Input error. {details}',
  P2020: 'Value out of range for the type. {details}',
  P2021: 'The table {table} does not exist in the current database.',
  P2022: 'The column {column} does not exist in the current database.',
  P2023: 'Inconsistent column data: {message}',
  P2024:
    'Timed out fetching a new connection from the connection pool. (More info: http://pris.ly/d/connection-pool, Current connection limit: {connection_limit})',
  P2025:
    'An operation failed because it depends on one or more records that were required but not found. {cause}',
  P2026:
    "The current database provider doesn't support a feature that the query used: {feature}",
  P2027:
    'Multiple errors occurred on the database during query execution: {errors}',
  P2030:
    'Cannot find a fulltext index to use for the search, try adding a @@fulltext([Fields...]) to your schema',
  P2031:
    'Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set. See details: https://pris.ly/d/mongodb-replica-set',
  P2033:
    "A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers",
  // TODO: add other codes:
  // https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
};

export const transactionDefaultOptions = {
  // isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
  maxWait: 5000,
  timeout: 10000,
};
