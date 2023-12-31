import React from 'react';
import {createUniversalProvider} from '@shopify/react-universal-provider';

import type {NetworkManager} from './manager';

export const NetworkContext = React.createContext<NetworkManager | null>(null);

export interface NetworkUniversalDetails {
  headers: {[key: string]: string};
}
export const NetworkUniversalContext =
  React.createContext<NetworkUniversalDetails | null>(null);
export const NetworkUniversalProvider = createUniversalProvider(
  'network-details',
  NetworkUniversalContext,
);
