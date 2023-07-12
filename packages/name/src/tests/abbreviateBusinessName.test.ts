import {tryAbbreviateBusinessName} from '../utilities';
import {abbreviateBusinessName} from '..';

describe('#abbreviateBusinessName()', () => {
  it('returns input name if no abbreviation found', () => {
    // no abbreviation as has space in last name
    const input = {name: '😀😃😄'};
    expect(abbreviateBusinessName(input)).toBe(input.name);
  });

  it('returns abbreviated name if abbreviation found', () => {
    const input = {name: 'shop-123'};
    expect(abbreviateBusinessName(input)).toBeDefined();
    expect(abbreviateBusinessName(input)).toBe(
      tryAbbreviateBusinessName(input),
    );
  });
});
