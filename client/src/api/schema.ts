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

interface UpdateSchemaUsersDto {
  authId: string;
  schemaId: string;
  isPublic: boolean;
  users: { email: string; role: 'admin' | 'viewer' | 'editor' }[];
  schema: Schema;
}

export const updateSchemaUsersApi = async ({ authId, schemaId, users, isPublic, schema }: UpdateSchemaUsersDto) => {
  const res = await client.post(
    `/schema/${schemaId}/users`,
    {
      users,
      isPublic,
      schema,
    },
    {
      headers: {
        'x-auth-id': authId,
      },
    }
  );

  return res.data.data;
};

export const deleteSchemaApi = async (authId: string, schemaId: string) => {
  const res = await client.delete(`/schema/${schemaId}/delete`, {
    headers: {
      'x-auth-id': authId,
    },
  });

  return res.data.data;
};
