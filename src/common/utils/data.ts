// CREDITS: https://github.com/xpepermint/query-types/blob/master/index.js
// import type { ParsedQs } from "qs";

import { DataType } from '../types';

/**
 * It returns true if the value passed to it is an object, and false if it's not
 * @param {any} val - any
 * @returns The constructor of the object.
 */
export const isObject = (val: any) => {
  return val.constructor === Object;
};

/**
 * If the value is not a number, then it's not a number.
 * @param {any} val - any - The value to check
 * @returns A function that takes a parameter and returns a boolean.
 */
export const isNumber = (val: any) => {
  return !isNaN(parseFloat(val)) && isFinite(val);
};

/**
 * It returns true if the value is a string that is either 'true' or 'false'
 * @param {any} val - any
 * @returns A function that takes a parameter and returns a boolean.
 */
export const isBoolean = (val: any) => {
  return val === 'false' || val === 'true';
};

export const isDate = (dateString) => {
  if (isNumber(dateString)) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
/**
 * If the value is an array, return true, otherwise return false.
 * @param {any} val - any
 * @returns A function that takes a parameter and returns a boolean.
 */
export const isArray = (val: any) => {
  return Array.isArray(val);
};

/**
 * It takes an object, and returns an object with the same keys, but with the values parsed
 * @param {ParsedQs} obj - ParsedQs - The object to parse.
 * @returns An object with the key and value of the parsed object.
 */
export const parseObject = (obj: any) => {
  let result = {};
  let key, val;
  for (key in obj) {
    val = parseValue(obj[key]);
    if (val !== null) result = { [key]: val }; // ignore null values
  }
  return result;
};

/**
 * It takes an array of strings and returns an array of objects.
 * @param {string | any[]} arr - string | any[]
 * @returns An array of parsed values.
 */
export const parseArray = (arr: string | any[]): any[] => {
  const result: any[] = [];
  for (let i = 0; i < arr.length; i++) {
    result[i] = parseValue(arr[i]);
  }
  return result;
};

/**
 * It takes a value, converts it to a number, and returns it.
 * @param {any} val - any - The value to be parsed.
 * @returns A function that takes a parameter and returns a number.
 */
export const parseNumber = (val: any) => {
  return Number(val);
};

/**
 * It returns true if the value is the string 'true', otherwise it returns false
 * @param {any} val - any - The value to parse.
 * @returns A function that takes a parameter and returns a boolean.
 */
export const parseBoolean = (val: any) => {
  return val === 'true';
};

/**
 * If the value is a boolean, array, object, or number, parse it. Otherwise, return the value.
 * @param {any} val - any
 * @returns the value of the variable val.
 */
export const parseValue = (val: any) => {
  console.log({ isDate: isDate(val), isNumber: isNumber(val) });
  if (typeof val === 'undefined' || val === '') {
    return null;
  } else if (isBoolean(val)) {
    return parseBoolean(val);
  } else if (isDate(val)) {
    return new Date(val);
  } else if (isArray(val)) {
    return parseArray(val);
  } else if (isObject(val)) {
    return parseObject(val);
  } else if (isNumber(val)) {
    return parseNumber(val);
  } else {
    return val;
  }
};

export const parseData = (val: any, dataType: DataType) => {
  if (typeof val === 'undefined' || val === '') {
    return null;
  } else if (dataType == 'boolean') {
    return parseBoolean(val);
  } else if (dataType == 'date') {
    return new Date(val);
  } else if (dataType == 'array') {
    return parseArray(val);
  } else if (dataType == 'object') {
    return parseObject(val);
  } else if (dataType == 'number') {
    return parseNumber(val);
  } else if (dataType == 'bigint') {
    return BigInt(val);
  } else {
    return val;
  }
};

/**
 * It takes a query object, parses it, and then returns a new object with the parsed values
 * @returns A function that takes in a request and a response and a next function.
 */
// export const queryParseMiddleware = () => {
//     return (req: { query: ParsedQs; }, _res: any, next: () => void) => {
//         req.query = parseObject(req.query);
//         next();
//     }
// }
