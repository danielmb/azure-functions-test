import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { z } from 'zod';
import { Prisma, PrismaClient } from '@prisma/client';
const db = new PrismaClient();

const GET = async (
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> => {
  const items = await db.navn.findMany();
  return {
    jsonBody: items,
  };
};

export const POST = async (
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> => {
  const body = z
    .object({
      fornavn: z.string(),
      etternavn: z.string(),
    })
    .parse(await request.json());

  const item = await db.navn.create({
    data: {
      fornavn: body.fornavn,
      etternavn: body.etternavn,
    },
  });
  return {
    jsonBody: item,
    status: 201, // Created
  };
};

export async function hentNavner(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  if (request.method === 'GET') {
    return GET(request, context);
  }
  if (request.method === 'POST') {
    return POST(request, context);
  }
  return {
    status: 405, // Method Not Allowed
  };
}

app.http('navn-prisma', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: hentNavner,
});
