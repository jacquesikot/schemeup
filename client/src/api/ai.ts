import client from './client';

interface GetSchemaSuggestionsDto {
  sql: string;
  userId: string;
}

export const getSchemaSuggestionsApi = async ({ sql, userId }: GetSchemaSuggestionsDto) => {
  const res = await client.post('/ai/schema/suggestion', sql, {
    headers: {
      'Content-Type': 'text/plain',
      'x-auth-id': userId,
    },
  });

  return res.data.data;
};
