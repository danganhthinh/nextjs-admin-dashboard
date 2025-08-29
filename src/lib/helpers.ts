import {
  isArray,
  isDate,
  isEmpty,
  isFunction,
  isNil,
  isObject,
  isString,
  keys,
  map,
  omitBy,
  reduce,
  reject,
  toString,
  trim,
} from 'lodash';

export interface IGetProductPriceReturn {
  salePrice?: number;
  price: number;
  discount?: number;
  discountRate?: number;
  minPrice?: number;
  maxPrice?: number;
}

interface trimObjectValuesProps {
  omitEmpty?: boolean;
}

export const trimObjectValues = (
  values: any,
  { omitEmpty }: trimObjectValuesProps = { omitEmpty: false }
): any => {
  try {
    JSON.parse(JSON.stringify(values));

    const isRemove = (val: any) => {
      if (isObject(val) && !isFunction(val) && !isDate(val))
        return isEmpty(val);
      if (isString(val)) return !val;
      return isNil(val);
    };

    const trims = (val: any): any => {
      if (isString(val)) return trim(val);

      if (isFunction(val) || isDate(val) || !isObject(val)) return val;

      if (isArray(val)) {
        const results = map(val, (value) => trims(value));
        return omitEmpty ? reject(results, (it) => isRemove(it)) : results;
      }

      const results = reduce(
        keys(val),
        (prev: any, key) => ({ ...prev, [key]: trims((val as any)[key]) }),
        {}
      );

      return omitEmpty ? omitBy(results, (it) => isRemove(it)) : results;
    };

    return trims(values);
  } catch (error) {
    return values;
  }
};

export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = { ...err, ...errorExt };
        return [parsedError, undefined];
      }

      return [err, undefined];
    });
}

export const formatNumber = (val: number | null | undefined) => {
  if (isNil(val)) return 0;

  return toString(val)?.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const getProductPrice = (product: any): IGetProductPriceReturn => {
  const result: IGetProductPriceReturn = {
    price: product?.price || 0,
    minPrice: 0,
    maxPrice: 0,
    discount: 0,
    discountRate: 0,
    salePrice: product?.price,
  };

  if (!product || !product?.price || product?.price <= 0) {
    return result;
  }

  const hasDiscount = product?.discount > 0 || product?.discountRate > 0;
  const hasPriceRange = product?.minPrice > 0 && product?.maxPrice > 0;

  if (hasDiscount) {
    const discountRate =
      product?.discountRate > 0
        ? product?.discountRate
        : (product.discount / product.price) * 100;
    const discount =
      product?.discount > 0
        ? product?.discount
        : (product.price * product.discountRate) / 100;

    result.discount = discount;
    result.discountRate = discountRate;
    result.salePrice = product.price - discount;
  }

  if (hasPriceRange) {
    result.minPrice = product?.minPrice;
    result.maxPrice =
      product?.minPrice === product?.maxPrice
        ? product?.minPrice
        : product?.maxPrice;
  }

  return result;
};