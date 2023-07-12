import {UnicodeCharacterSet} from '../constants';

import {identifyScripts} from './identifyScripts';
import {getGraphemes} from './getGraphemes';

// Note: A similar Ruby implementation of this function also exists at https://github.com/Shopify/shopify-i18n/blob/main/lib/shopify-i18n/name_formatter.rb.
export function tryAbbreviateName({
  givenName,
  familyName,
  idealMaxLength = 3,
}: {
  givenName?: string;
  familyName?: string;
  idealMaxLength?: number;
}): string | undefined {
  if (!givenName && !familyName) {
    return undefined;
  }

  const firstNameTrimmed = givenName?.trim();
  const lastNameTrimmed = familyName?.trim();

  const combinedName = [firstNameTrimmed, lastNameTrimmed].join('');
  if (new RegExp(`${UnicodeCharacterSet.Punctuation}|\\s`).test(combinedName)) {
    return undefined;
  }

  const scripts = identifyScripts(combinedName);
  if (scripts.length !== 1) {
    return undefined;
  }
  const script = scripts[0];

  switch (script) {
    case UnicodeCharacterSet.Latin:
      return [firstNameTrimmed?.[0], lastNameTrimmed?.[0]].join('');
    case UnicodeCharacterSet.Han:
    case UnicodeCharacterSet.Katakana:
    case UnicodeCharacterSet.Hiragana:
      return lastNameTrimmed;
    case UnicodeCharacterSet.Hangul:
      if (firstNameTrimmed) {
        if (firstNameTrimmed.length > idealMaxLength) {
          return getGraphemes({text: firstNameTrimmed, locale: 'ko'})?.[0];
        } else {
          return firstNameTrimmed;
        }
      } else {
        return lastNameTrimmed;
      }
    case UnicodeCharacterSet.Thai:
      if (firstNameTrimmed) {
        return getGraphemes({text: firstNameTrimmed, locale: 'th'})?.[0];
      } else {
        return getGraphemes({text: lastNameTrimmed, locale: 'th'})?.[0];
      }
    default:
      return undefined;
  }
}
