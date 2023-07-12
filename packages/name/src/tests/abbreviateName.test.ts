import {tryAbbreviateName} from '../utilities';
import {abbreviateName, formatName} from '..';

const locale = 'en';

describe('#abbreviateName()', () => {
  it('returns formatName if no abbreviation found', () => {
    // no abbreviation as has space in last name
    const name = {givenName: 'Michael', familyName: 'van Finkle'};
    expect(abbreviateName({name, locale})).toBe(formatName({name, locale}));
  });

  it('returns abbreviated name if abbreviation found', () => {
    const name = {givenName: 'Michael', familyName: 'Garfinkle'};
    expect(abbreviateName({name, locale})).toBeDefined();
    expect(abbreviateName({name, locale})).toBe(tryAbbreviateName(name));
  });
});
