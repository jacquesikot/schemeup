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

export const createOrUpdateUserSchemaApi = async (authId: string, schema: Schema) => {
  const res = await client.post('/schema', schema, {
    headers: {
      'x-auth-id': authId,
    },
  });

  return res.data.data;
};
