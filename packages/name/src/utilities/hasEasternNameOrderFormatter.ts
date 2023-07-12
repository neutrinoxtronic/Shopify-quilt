import {EASTERN_NAME_ORDER_FORMATTERS} from '../constants';

export function hasEasternNameOrderFormatter(locale: string) {
  const easternNameOrderFormatter = EASTERN_NAME_ORDER_FORMATTERS.get(locale);
  return Boolean(easternNameOrderFormatter);
}
