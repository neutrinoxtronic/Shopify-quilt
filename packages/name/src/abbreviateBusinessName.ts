// Note: A similar Ruby implementation of this function also exists at https://github.com/Shopify/shopify-i18n/blob/main/lib/shopify-i18n/business_name_formatter.rb.
import {tryAbbreviateBusinessName} from './utilities';

export function abbreviateBusinessName({
  name,
  idealMaxLength,
}: {
  name?: string;
  idealMaxLength?: number;
}) {
  return tryAbbreviateBusinessName({name, idealMaxLength}) ?? name;
}
