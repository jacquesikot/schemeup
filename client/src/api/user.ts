import client from './client';

export const getAllUsersApi = async (authId: string) => {
  const res = await client.get('/user/all', {
    headers: {
      'x-auth-id': authId,
    },
  });

  return res.data.data;
};
