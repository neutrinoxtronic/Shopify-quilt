import type {
  Country,
  LoadCountriesResponse,
  LoadCountryResponse,
  ResponseError,
} from '@shopify/address-consts';
import {
  GRAPHQL_ENDPOINT,
  HEADERS,
  GraphqlOperationName,
} from '@shopify/address-consts';

import query from './graphqlQuery';

export const loadCountries: (
  locale: string,
  options?: {includeHiddenZones?: boolean},
) => Promise<Country[]> = memoizeAsync(
  async (locale: string, {includeHiddenZones = false} = {}) => {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        query,
        operationName: GraphqlOperationName.Countries,
        variables: {
          locale: locale.replace(/-/, '_').toUpperCase(),
          includeHiddenZones,
        },
      }),
    });

    const countries: LoadCountriesResponse | ResponseError =
      await response.json();

    if (!('data' in countries) && 'errors' in countries) {
      throw new CountryLoaderError(countries);
    }

    return countries.data.countries;
  },
);

export const loadCountry: (
  locale: string,
  countryCode: string,
  options?: {includeHiddenZones?: boolean},
) => Promise<Country> = memoizeAsync(
  async (
    locale: string,
    countryCode: string,
    {includeHiddenZones = false} = {},
  ): Promise<Country> => {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        query,
        operationName: GraphqlOperationName.Country,
        variables: {
          countryCode,
          locale: locale.replace(/-/, '_').toUpperCase(),
          includeHiddenZones,
        },
      }),
    });

    const country: LoadCountryResponse | ResponseError = await response.json();

    if (!('data' in country) && 'errors' in country) {
      throw new CountryLoaderError(country);
    }

    return country.data.country;
  },
);

export class CountryLoaderError extends Error {
  constructor(errors: ResponseError) {
    const errorMessage = errors.errors.map((error) => error.message).join('; ');
    super(errorMessage);
  }
}

type AsyncFunc = (...args: any[]) => Promise<any>;
interface Cache {
  [key: string]: Promise<any>;
}

function memoizeAsync(this: unknown, asyncFunction: AsyncFunc) {
  const cache: Cache = {};

  return (...args: any[]) => {
    const stringifiedArgs = JSON.stringify(args);
    if (!cache[stringifiedArgs]) {
      cache[stringifiedArgs] = asyncFunction.apply(this, args);
    }
    return cache[stringifiedArgs];
  };
}
