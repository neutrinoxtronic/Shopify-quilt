import {join} from 'path';
import {existsSync} from 'fs';

import React from 'react';
import type {Context} from 'koa';
import compose from 'koa-compose';
import type {HtmlProps} from '@shopify/react-html/server';
import {
  Html,
  HtmlManager,
  HtmlContext,
  stream,
  render as renderHtml,
} from '@shopify/react-html/server';
import {useSerialized} from '@shopify/react-html';
import {
  applyToContext,
  NetworkContext,
  NetworkManager,
} from '@shopify/react-network/server';
import {extract} from '@shopify/react-effect/server';
import {HydrationContext, HydrationManager} from '@shopify/react-hydrate';
import {
  AsyncAssetContext,
  AsyncAssetManager,
  AssetTiming,
} from '@shopify/react-async';
import {Header, StatusCode} from '@shopify/react-network';
import {
  getAssets,
  middleware as sewingKitMiddleware,
} from '@shopify/sewing-kit-koa';

import {quiltDataMiddleware} from '../quilt-data';
import {getLogger} from '../logger';
import type {ValueFromContext} from '../types';

import {fallbackErrorMarkup} from './error';

export type {Context};
export interface RenderFunction {
  (ctx: Context): React.ReactElement<any>;
}

interface Data {
  value: {[key: string]: any} | undefined;
}

export type RenderOptions = Pick<
  NonNullable<Parameters<typeof extract>[1]>,
  'afterEachPass' | 'betweenEachPass'
> & {
  assetPrefix?: string;
  assetName?: string | ValueFromContext<string>;
  renderError?: RenderFunction;
  renderRawErrorMessage?: boolean;
  htmlProps?: HtmlProps | ValueFromContext<HtmlProps>;
};

/**
 * Creates a Koa middleware for rendering an `@shopify/react-html` based React application defined by `render`.
 * @param render
 * @param options
 */
export function createRender(
  render: RenderFunction,
  options: RenderOptions = {},
) {
  const manifestPath = getManifestPath(process.cwd());
  const {
    assetPrefix,
    assetName: assetNameInput = 'main',
    renderError,
    renderRawErrorMessage,
    htmlProps: htmlPropsInput = {},
  } = options;

  async function renderFunction(ctx: Context) {
    const assetName =
      typeof assetNameInput === 'function'
        ? assetNameInput(ctx)
        : assetNameInput;

    const {
      scripts: additionalScripts = [],
      styles: additionalStyles = [],
      ...additionalHtmlProps
    } = typeof htmlPropsInput === 'function'
      ? htmlPropsInput(ctx)
      : htmlPropsInput;

    const logger = getLogger(ctx) || console;
    const assets = getAssets(ctx);

    const networkManager = new NetworkManager({
      headers: ctx.headers as {[key: string]: string},
      cookies: ctx.request.headers.cookie || '',
    });
    const htmlManager = new HtmlManager();
    const asyncAssetManager = new AsyncAssetManager();
    const hydrationManager = new HydrationManager();

    function Providers({children}: {children: React.ReactElement<any>}) {
      const [, Serialize] = useSerialized<Data>('quilt-data');

      return (
        <AsyncAssetContext.Provider value={asyncAssetManager}>
          <HydrationContext.Provider value={hydrationManager}>
            <NetworkContext.Provider value={networkManager}>
              {children}
              <Serialize data={() => ctx.state.quiltData} />
            </NetworkContext.Provider>
          </HydrationContext.Provider>
        </AsyncAssetContext.Provider>
      );
    }

    try {
      const app = render(ctx);
      await extract(app, {
        decorate(element) {
          return (
            <HtmlContext.Provider value={htmlManager}>
              <Providers>{element}</Providers>
            </HtmlContext.Provider>
          );
        },
        afterEachPass({renderDuration, resolveDuration, index, finished}) {
          const pass = `Pass number ${index} ${
            finished ? ' (this was the final pass)' : ''
          }`;
          const rendering = `Rendering took ${renderDuration}ms`;
          const resolving = `Resolving promises took ${resolveDuration}ms`;

          logger.log(pass);
          logger.log(rendering);
          logger.log(resolving);
        },
        ...options,
      });
      applyToContext(ctx, networkManager);

      const immediateAsyncAssets = asyncAssetManager.used(
        AssetTiming.Immediate,
      );
      const [styles, scripts] = await Promise.all([
        assets.styles({name: assetName, asyncAssets: immediateAsyncAssets}),
        assets.scripts({name: assetName, asyncAssets: immediateAsyncAssets}),
      ]);

      styles.push(...additionalStyles);
      scripts.push(...additionalScripts);

      const response = stream(
        <Html
          {...additionalHtmlProps}
          manager={htmlManager}
          styles={styles}
          scripts={scripts}
        >
          <Providers>{app}</Providers>
        </Html>,
      );

      ctx.set(Header.ContentType, 'text/html');
      ctx.body = response;
    } catch (error) {
      const errorMessage = `React server-side rendering error:\n${
        error.stack || error.message
      }`;

      logger.log(errorMessage);
      ctx.status = StatusCode.InternalServerError;
      ctx.state.quiltError = error;

      if (renderRawErrorMessage) {
        ctx.body = errorMessage;
      } else {
        if (renderError) {
          const [styles, scripts] = await Promise.all([
            assets.styles({name: 'error'}),
            assets.scripts({name: 'error'}),
          ]);

          const response = renderHtml(
            <Html manager={htmlManager} styles={styles} scripts={scripts}>
              {renderError(ctx)}
            </Html>,
          );

          ctx.body = response;
        } else {
          ctx.body = fallbackErrorMarkup;
          ctx.set(Header.ContentType, 'text/html');
        }

        ctx.throw(StatusCode.InternalServerError, error);
      }
    }
  }

  return compose([
    quiltDataMiddleware,
    sewingKitMiddleware({assetPrefix, manifestPath}),
    renderFunction,
  ]);
}

function getManifestPath(root: string) {
  const gemFileExists = existsSync(join(root, 'Gemfile'));
  if (!gemFileExists) {
    return;
  }

  // eslint-disable-next-line no-process-env
  return process.env.NODE_ENV === 'development'
    ? `tmp/sewing-kit/sewing-kit-manifest.json`
    : `public/bundles/sewing-kit-manifest.json`;
}
