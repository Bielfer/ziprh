/* eslint @typescript-eslint/no-explicit-any:off */
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext } from '~/server/context';
import appRouter from '~/server/routers/_app';

const handler = (request: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: createContext as any,
  });
};

export { handler as GET, handler as POST };
