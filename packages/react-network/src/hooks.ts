import {useContext} from 'react';
import type {Language} from 'accept-language-parser';
import {parse} from 'accept-language-parser';
import type {CspDirective, StatusCode} from '@shopify/network';
import {Header} from '@shopify/network';
import {useServerEffect} from '@shopify/react-effect';

import {NetworkContext, NetworkUniversalContext} from './context';
import type {NetworkManager} from './manager';

const NO_UNIVERSAL_PROVIDER_WARNING =
  'Could not find serialized network context. Ensure that your app is rendering <NetworkUniversalProvider /> above in your tree';

export function useNetworkEffect(perform: (network: NetworkManager) => void) {
  const network = useContext(NetworkContext);

  useServerEffect(() => {
    if (network != null) {
      return perform(network);
    }
  }, network?.effect);
}

export function useCspDirective(
  directive: CspDirective,
  source: string | string[] | boolean,
) {
  useNetworkEffect((network) => network.addCspDirective(directive, source));
}

export function useRequestHeader(header: string) {
  const manager = useNetworkManager();
  const details = useContext(NetworkUniversalContext);

  if (manager) {
    // Server-side: get it directly from network context
    return manager.getHeader(header);
  } else if (details) {
    // Client-side: get it from serialized universal context
    return details.headers[header.toLowerCase()];
  } else {
    // No server-side network context and no universal context provider
    // eslint-disable-next-line no-console
    console.warn(NO_UNIVERSAL_PROVIDER_WARNING);
    return undefined;
  }
}

export function useHeader(header: string, value: string) {
  useNetworkEffect((network) => network.setHeader(header, value));
}

export function useNetworkManager() {
  return useContext(NetworkContext);
}

export function useStatus(code: StatusCode) {
  useNetworkEffect((network) => network.addStatusCode(code));
}

export function useRedirect(url: string, status?: StatusCode) {
  useNetworkEffect((network) => network.redirectTo(url, status));
}

export function useAcceptLanguage(
  fallback: Language = {code: 'en', quality: 1.0},
) {
  const acceptsLanguages = useRequestHeader(Header.AcceptLanguage);
  const locales = acceptsLanguages ? parse(acceptsLanguages) : [fallback];

  return locales;
}
