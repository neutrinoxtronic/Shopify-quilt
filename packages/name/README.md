# `@shopify/name`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fname.svg)](https://badge.fury.io/js/%40shopify%2Fname)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/%40shopify%2Fname.svg)

Utilities for formatting names.

## Installation

```bash
yarn add @shopify/name
```

## Usage

[![Code Sandbox Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/laughing-wright-lmqec5?fontsize=14&hidenavigation=1&theme=dark)

### formatName

Formats a name (given name and/or family name) according to the locale. For example:

- `formatName({name: {givenName: 'John', familyName: 'Smith'}, locale: 'en'})` will return `John` in Germany and `Smith様` in Japan
- `formatName({name: {givenName: 'John', familyName: 'Smith'}, locale: 'en', options: {full: true}})` will return `John Smith` in Germany and `SmithJohn` in Japan

`formatName.hasEasternNameOrderFormatter` returns true when an eastern name order formatter corresponding to the locale
exists.

### abbreviateName

Takes a name (given and family name) and returns a language appropriate abbreviated name, or will return `formatName` if
it is unable to find a suitable abbreviation.

For example, "John Smith" would be abbreviated to "JS", whereas "Ren Tanaka" (Japanese "健 田中") would be abbreviated
with the last name "田中".

You may also pass an optional `idealMaxLength` parameter, which gives the maximum allowable abbreviation length when
trying to abbreviate a name in the Korean language (default 3 characters). In Korean, if the first name is longer than
this length, the method will instead return the first character of the first name.

### abbreviateBusinessName

Takes a name and returns a language appropriate abbreviated name, or will return the input name if it is unable to find
a suitable abbreviation.

For example, "Shopify" would be abbreviated to "Sho", whereas "My Store" would be abbreviated to "MS".

You may also pass an optional `idealMaxLength` parameter, which gives the maximum allowable abbreviation length when
trying to abbreviate a name.
