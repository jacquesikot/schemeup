import client from './client';

interface ParsePgDumpDto {
  file: string;
  userId: string;
}

export const parsePgDump = async ({ file, userId }: ParsePgDumpDto) => {
  const res = await client.post('/schema/parse/postgres', file, {
    headers: {
      'Content-Type': 'text/plain',
      'x-auth-id': userId,
    },
  });

  return res.data.data;
};
