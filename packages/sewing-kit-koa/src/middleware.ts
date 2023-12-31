import {join} from 'path';

import type {Context, Middleware} from 'koa';
import serve from 'koa-static';
import compose from 'koa-compose';
import mount from 'koa-mount';
import appRoot from 'app-root-path';
import {Header} from '@shopify/network';

import type {Asset} from './assets';
import Assets from './assets';

export {Assets};
export type {Asset};

export interface Options {
  assetPrefix?: string;
  serveAssets?: boolean;
  manifestPath?: string;
  caching?: boolean;
  key?: symbol | string;
}

const ASSETS = Symbol('assets');
const DEFAULT_ASSETS = Symbol('default_assets');

export function getAssets(
  ctx: Context,
  key: string | symbol = DEFAULT_ASSETS,
): Assets {
  return (ctx.state as any)[ASSETS]?.[key];
}

export function setAssets(
  ctx: Context,
  assets: Assets,
  key: string | symbol = DEFAULT_ASSETS,
) {
  if ((ctx.state as any)[ASSETS] == null) {
    (ctx.state as any)[ASSETS] = {};
  }

  (ctx.state as any)[ASSETS][key] = assets;
}

export default function middleware({
  serveAssets = false,
  assetPrefix = defaultAssetPrefix(serveAssets),
  manifestPath,
  key,
  caching = true,
}: Options = {}): Middleware {
  async function sewingKitMiddleware(ctx: Context, next: () => Promise<any>) {
    const assets = new Assets({
      assetPrefix,
      userAgent: ctx.get(Header.UserAgent),
      manifestPath,
      caching,
    });

    setAssets(ctx, assets, key);

    await next();
  }

  return serveAssets && assetPrefix.startsWith('/')
    ? compose([
        sewingKitMiddleware,
        mount(assetPrefix, serve(join(appRoot.path, 'build/client'))),
      ])
    : sewingKitMiddleware;
}

function defaultAssetPrefix(serveAssets: boolean) {
  // In development, Sewing Kit defaults to running an asset server on
  // http://localhost:8080/webpack/assets/. When running in `serveAssets`
  // mode (the application server also serves the assets), we default to
  // assuming they have set the asset endpoint to be under /assets. In order
  // to use this feature, a developer would need to add the following to the
  // Sewing Kit config that built the assets:
  //
  // {
  //   plugins: [plugins.cdn('/assets/')],
  // }
  return serveAssets ? '/assets/' : 'http://localhost:8080/webpack/assets/';
}
