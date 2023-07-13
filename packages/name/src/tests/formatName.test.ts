import {formatName} from '..';

describe('#formatName()', () => {
  it('returns an empty string when nothing is defined', () => {
    const name = {givenName: undefined, familyName: undefined};
    const locale = 'en';
    expect(formatName({name, locale})).toBe('');
  });

  it('returns only the givenName when familyName is missing', () => {
    const name = {givenName: 'first'};
    const locale = 'en';
    expect(
      formatName({
        name,
        locale,
      }),
    ).toBe('first');
  });

  it('returns only the familyName when givenName is missing', () => {
    const name = {familyName: 'last'};
    const locale = 'en';
    expect(
      formatName({
        name,
        locale,
      }),
    ).toBe('last');
  });

  it('defaults to givenName for unknown locale', () => {
    const name = {givenName: 'first', familyName: 'last'};
    const locale = 'unknown';
    expect(
      formatName({
        name,
        locale,
      }),
    ).toBe('first');
  });

  it('defaults to givenName for locale without custom formatter', () => {
    const name = {givenName: 'first', familyName: 'last'};
    const locale = 'fr-CA';
    expect(
      formatName({
        name,
        locale,
      }),
    ).toBe('first');
  });

  it('returns givenName for English', () => {
    const name = {givenName: 'first', familyName: 'last'};
    const locale = 'en';
    expect(
      formatName({
        name,
        locale,
      }),
    ).toBe('first');
  });

  it('returns custom name for Japanese', () => {
    const name = {givenName: 'first', familyName: 'last'};
    const locale = 'ja';
    expect(
      formatName({
        name,
        locale,
      }),
    ).toBe('last様');
  });

  it('returns familyName only, for zh-CN', () => {
    const name = {givenName: 'first', familyName: 'last'};
    const locale = 'zh-CN';
    expect(
      formatName({
        name,
        locale,
      }),
    ).toBe('last');
  });

  it('returns familyName only, for zh-TW', () => {
    const name = {givenName: 'first', familyName: 'last'};
    const locale = 'zh-TW';
    expect(
      formatName({
        name,
        locale,
      }),
    ).toBe('last');
  });

  it('returns only the givenName when familyName is missing using full', () => {
    const locale = 'en';
    const options = {full: true};

    let name = {givenName: 'first', familyName: ''};
    expect(
      formatName({
        name,
        locale,
      }),
    ).toBe('first');
    expect(formatName({name, locale, options})).toBe('first');

    name = {givenName: 'first', familyName: undefined};
    expect(
      formatName({
        name,
        locale,
        options,
      }),
    ).toBe('first');
  });

  it('returns only the familyName when givenName is missing using full', () => {
    const name = {givenName: '', familyName: 'last'};
    const locale = 'en';
    const options = {full: true};

    expect(
      formatName({
        name,
        locale,
        options,
      }),
    ).toBe('last');
  });

  it('returns a string when familyName is undefined using full', () => {
    const name = {givenName: '', familyName: undefined};
    const locale = 'en';
    const options = {full: true};

    expect(
      formatName({
        name,
        locale,
        options,
      }),
    ).toBe('');
  });

  it('returns a string when first and familyName are missing using full', () => {
    const name = {givenName: undefined, familyName: undefined};
    const locale = 'en';
    const options = {full: true};

    expect(
      formatName({
        name,
        locale,
        options,
      }),
    ).toBe('');
  });

  it('defaults to givenName familyName for unknown locale using full', () => {
    const name = {givenName: 'first', familyName: 'last'};
    const locale = 'unknown';
    const options = {full: true};

    expect(
      formatName({
        name,
        locale,
        options,
      }),
    ).toBe('first last');
  });

  it('uses fallback locale value for locale without custom formatter using full', () => {
    const name = {givenName: 'first', familyName: 'last'};
    const locale = 'fr-CA';
    const options = {full: true};

    expect(
      formatName({
        name,
        locale,
        options,
      }),
    ).toBe('first last');
  });

  it('returns givenName first for English using full', () => {
    const name = {givenName: 'first', familyName: 'last'};
    const locale = 'en';
    const options = {full: true};

    expect(
      formatName({
        name,
        locale,
        options,
      }),
    ).toBe('first last');
  });

  it('returns familyName first and no space for Japanese', () => {
    const name = {givenName: 'first', familyName: 'last'};
    const locale = 'ja';
    const options = {full: true};

    expect(
      formatName({
        name,
        locale,
        options,
      }),
    ).toBe('lastfirst');
  });

  it('returns familyName first and no space for Korean', () => {
    const name = {givenName: 'first', familyName: 'last'};
    const locale = 'ko';
    const options = {full: true};

    expect(
      formatName({
        name,
        locale,
        options,
      }),
    ).toBe('lastfirst');
  });

  it('returns familyName first and no space for zh-CN', () => {
    const name = {givenName: 'first', familyName: 'last'};
    const locale = 'zh-CN';
    const options = {full: true};

    expect(
      formatName({
        name,
        locale,
        options,
      }),
    ).toBe('lastfirst');
  });

  it('returns familyName first and no space for zh-TW', () => {
    const name = {givenName: 'first', familyName: 'last'};
    const locale = 'zh-TW';
    const options = {full: true};

    expect(
      formatName({
        name,
        locale,
        options,
      }),
    ).toBe('lastfirst');
  });
});

describe('#formatName.hasEasternNameOrderFormatter()', () => {
  it('returns true if easternNameOrderFormatter exists', () => {
    expect(formatName.hasEasternNameOrderFormatter('ja')).toBe(true);
  });

  it('returns false if custom name formatter does not exist', () => {
    expect(formatName.hasEasternNameOrderFormatter('en')).toBe(false);
  });
});
