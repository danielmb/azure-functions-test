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
  const items = await db.users.findMany();

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
      firstName: z.string(),
      middleName: z.string().optional(),
      lastName: z.string(),
    })
    .parse(await request.json());

  const user = await db.users.create({
    data: {
      name: {
        create: {
          firstName: body.firstName,
          middleName: body.middleName,
          lastName: body.lastName,
        },
      },
    },
  });
  return {
    jsonBody: user,
    status: 201, // Created
  };
};

export async function getUsers(
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

app.http('users', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: getUsers,
});
