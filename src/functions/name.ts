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
  const id = request.query.get('id');
  if (!id) {
    return {
      status: 400, // Bad Request
    };
  }
  const items = await db.name.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  return {
    jsonBody: items,
  };
};

export async function getName(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  if (request.method === 'GET') {
    return GET(request, context);
  }

  return {
    status: 405, // Method Not Allowed
  };
}

app.http('name', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: getName,
});
