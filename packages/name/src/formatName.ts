import {EASTERN_NAME_ORDER_FORMATTERS} from './constants';
import {hasEasternNameOrderFormatter} from './utilities';

export const formatName = Object.assign(
  ({
    name,
    locale,
    options,
  }: {
    name: {givenName?: string; familyName?: string};
    locale: string;
    options?: {full?: boolean};
  }) => {
    if (!name.givenName) {
      return name.familyName || '';
    }
    if (!name.familyName) {
      return name.givenName;
    }

    const isFullName = Boolean(options && options.full);

    const customNameFormatter = EASTERN_NAME_ORDER_FORMATTERS.get(locale);

    if (customNameFormatter) {
      return customNameFormatter(name.givenName, name.familyName, isFullName);
    }
    if (isFullName) {
      return `${name.givenName} ${name.familyName}`;
    }
    return name.givenName;
  },
  {
    hasEasternNameOrderFormatter: (locale: string) =>
      hasEasternNameOrderFormatter(locale),
  },
);
