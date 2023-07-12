// Note: A similar Ruby implementation of this function also exists at https://github.com/Shopify/shopify-i18n/blob/main/lib/shopify-i18n/name_formatter.rb.
import {tryAbbreviateName} from './utilities';

import {formatName} from '.';

export function abbreviateName({
  name,
  locale,
  options,
}: {
  name: {givenName?: string; familyName?: string};
  locale: string;
  options?: {idealMaxLength?: number};
}) {
  return (
    tryAbbreviateName({
      givenName: name.givenName,
      familyName: name.familyName,
      idealMaxLength: options?.idealMaxLength,
    }) ?? formatName({name, locale})
  );
}
