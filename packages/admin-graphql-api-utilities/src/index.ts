const GID_TYPE_REGEXP = /^gid:\/\/[\w-]+\/([\w-]+)\//;
const GID_REGEXP = /\/(\w[\w-]*)(?:\?(.*))*$/;

export type Gid<
  Namespace extends string,
  Type extends string,
> = `gid://${Namespace}/${Type}/${number | string}`;

export type ShopifyGid<T extends string> = Gid<'shopify', T>;

interface ParsedGid {
  id: string;
  params: {[key: string]: string};
}

export function parseGidType(gid: string): string {
  const matches = GID_TYPE_REGEXP.exec(gid);

  if (matches && matches[1] !== undefined) {
    return matches[1];
  }
  throw new Error(`Invalid gid: ${gid}`);
}

export function parseGid(gid: string): string {
  // prepends forward slash to help identify invalid id
  const id = `/${gid}`;
  const matches = GID_REGEXP.exec(id);
  if (matches && matches[1] !== undefined) {
    return matches[1];
  }
  throw new Error(`Invalid gid: ${gid}`);
}

export function parseGidWithParams(gid: string): ParsedGid {
  // prepends forward slash to help identify invalid id
  const id = `/${gid}`;
  const matches = GID_REGEXP.exec(id);
  if (matches && matches[1] !== undefined) {
    const params =
      matches[2] === undefined
        ? {}
        : fromEntries(new URLSearchParams(matches[2]).entries());

    return {
      id: matches[1],
      params,
    };
  }
  throw new Error(`Invalid gid: ${gid}`);
}

export function composeGidFactory<N extends string>(namespace: N) {
  return function composeGid<T extends string>(
    key: T,
    id: number | string,
    params: {[key: string]: string} = {},
  ): Gid<N, T> {
    const gid = `gid://${namespace}/${key}/${id}`;
    const paramKeys = Object.keys(params);

    if (paramKeys.length === 0) {
      return gid as Gid<N, T>;
    }

    const paramString = new URLSearchParams(params).toString();
    return `${gid}?${paramString}` as Gid<N, T>;
  };
}

export const composeGid = composeGidFactory('shopify');

export function isGidFactory<N extends string>(namespace: N) {
  return function isGid<T extends string = string>(
    gid: string,
    key?: T,
  ): gid is Gid<N, T> {
    if (!gid.startsWith(`gid://${namespace}/`)) {
      return false;
    }

    try {
      if (key !== undefined && parseGidType(gid) !== key) {
        return false;
      }
    } catch {
      return false;
    }

    // prepends forward slash to help identify invalid id
    const id = `/${gid}`;
    return GID_REGEXP.test(id);
  };
}

export const isGid = isGidFactory('shopify');

interface Edge<T> {
  node: T;
}

export function nodesFromEdges<T>(edges: Edge<T>[]): T[] {
  return edges.map(({node}) => node);
}

export function keyFromEdges<T, K extends keyof T>(
  edges: Edge<T>[],
  key: K,
): T[K][] {
  return edges.map(({node}) => node[key]);
}

// Once we update to Node 12, we can drop this helper to use `Object.fromEntries` instead.
function fromEntries<K extends string, T>(entries: IterableIterator<[K, T]>) {
  const obj = {} as {[key in K]: T};
  for (const [key, val] of entries) {
    obj[key] = val;
  }
  return obj;
}
