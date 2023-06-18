import { Schema } from '../redux/slice/schemas';
import client from './client';

export const getUserSchemasApi = async (authId: string) => {
  const res = await client.get('/schema', {
    headers: {
      'x-auth-id': authId,
    },
  });

  return res.data.data;
};

export const createUserSchemaApi = async (authId: string, schema: Omit<Schema, 'id'>) => {
  const res = await client.post(
    '/schema',
    {
      ...schema,
      userId: authId,
    },
    {
      headers: {
        'x-auth-id': authId,
      },
    }
  );

  return res.data.data;
};
