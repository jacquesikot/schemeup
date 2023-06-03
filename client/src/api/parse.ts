import client from './client';

export const parsePgDump = async (file: string) => {
  return await client.post('/schema/parse-pg-dump', file, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
