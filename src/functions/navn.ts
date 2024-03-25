import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  input,
  output,
} from '@azure/functions';
import { z } from 'zod';
const sqlInput = input.sql({
  commandText: 'SELECT * FROM dbo.navn',
  commandType: 'Text',
  connectionStringSetting: 'SqlConnectionString',
});

const sqlOutput = output.sql({
  commandText: 'dbo.navn',
  connectionStringSetting: 'SqlConnectionString',
});

const GET = async (
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> => {
  const items = context.extraInputs.get(sqlInput);
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

  context.extraOutputs.set(sqlOutput, {
    fornavn: body.fornavn,
    etternavn: body.etternavn,
  });

  return {
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

app.http('navn', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: hentNavner,
  extraInputs: [sqlInput],
  extraOutputs: [sqlOutput],
});
