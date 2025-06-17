import { createRequestHandler, unstable_createContext } from "react-router";
import ConsoleLogger from "~/infra/logger/console-logger";
import type { I_Logger } from "~/infra/logger/types";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export const ServerGlobalContext = unstable_createContext<{
  cloudflare: {
    env: Env;
    ctx: ExecutionContext;
  };
  logger: I_Logger;
}>();

function determineTTL(pathname: string, env: Env, logger: I_Logger): number {
  const customTTLEntries = Object.entries(env.CACHE.CUSTOM_TTL_PATH_DICT);

  for (const [path, ttl] of customTTLEntries) {
    if (pathname === path) {
      logger.debug(`use custom TTL for ${path} is ${ttl}`);
      return ttl;
    }
  }

  return env.CACHE.DEFAULT_TTL;
}

async function getCachedResponse(
  cacheKey: Request,
  cacheStorage: Cache,
  ttl: number,
  logger: I_Logger
): Promise<Response | null> {
  if (ttl <= 0) {
    logger.debug(`ttl is 0, ignore getting cache : ${cacheKey.url}`);
    return null;
  }

  const cachedResponse = await cacheStorage.match(cacheKey);
  if (cachedResponse) {
    logger.debug(`Cache hit - return cached response : ${cacheKey.url}`);
    return cachedResponse;
  }

  logger.debug(`Cache miss : ${cacheKey.url}`);
  return null;
}

async function putResponseToCache(
  response: Response,
  ctx: ExecutionContext,
  cacheKey: Request,
  cacheStorage: Cache,
  ttl: number,
  logger: I_Logger
): Promise<Response> {
  if (response.status !== 200) {
    logger.debug(
      `response is not 200, given ${response.status}, ignore putting cache: ${cacheKey.url}`
    );
    return response;
  }

  if (ttl <= 0) {
    logger.debug(`ttl is 0, ignore putting cache : ${cacheKey.url}`);
    return response;
  }

  response.headers.append("Cache-Control", `s-maxage=${ttl}`);
  ctx.waitUntil(cacheStorage.put(cacheKey, response.clone()));
  logger.debug(`put response to cache: ${cacheKey.url}`);

  return response;
}

export default {
  async fetch(request, env, ctx) {
    const logger = new ConsoleLogger({ level: env.LOG.LEVEL });
    const urlWithoutQueryParams = new URL(request.url.split("?")[0]);
    const cacheStorage = await caches.open("cache");
    const cacheKey = new Request(urlWithoutQueryParams.toString(), request);
    const cacheTTL = determineTTL(urlWithoutQueryParams.pathname, env, logger);

    const cachedResponse = await getCachedResponse(
      cacheKey,
      cacheStorage,
      cacheTTL,
      logger
    );
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await requestHandler(
      request,
      //pass context as Map with unstable_createContext to use unstable_middleware
      new Map([
        [
          ServerGlobalContext,
          {
            cloudflare: { env, ctx },
            logger,
          },
        ],
      ])
    );

    return await putResponseToCache(
      response,
      ctx,
      cacheKey,
      cacheStorage,
      cacheTTL,
      logger
    );
  },
} satisfies ExportedHandler<Env>;
