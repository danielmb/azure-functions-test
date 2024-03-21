import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';

export async function jobbVennlig(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const name = request.query.get('name') || (await request.text());
  const jobb = request.query.get('jobb') || (await request.text());

  if (!name || !jobb) {
    context.error('Mangler navn eller jobb');
    throw new Error('Mangler navn eller jobb');
  }
  return {
    body: `Dette er en jobbvennlig funksjon, ${name}! Din jobb er ${jobb}`,
  };
}

app.http('jobb-vennlig', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: jobbVennlig,
});
