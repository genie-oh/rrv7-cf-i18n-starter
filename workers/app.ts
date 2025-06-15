import { createRequestHandler, unstable_createContext } from "react-router";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export const ServerGlobalContext = unstable_createContext<{
  cloudflare: {
    env: Env;
    ctx: ExecutionContext;
  };
}>();

export default {
  async fetch(request, env, ctx) {
    return requestHandler(
      request,
      //pass context as Map with unstable_createContext to use unstable_middleware
      new Map([
        [
          ServerGlobalContext,
          {
            cloudflare: { env, ctx },
          },
        ],
      ])
    );
  },
} satisfies ExportedHandler<Env>;
