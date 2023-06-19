import client from './client';

export interface SignUpUserDto {
  email: string;
  fullName: string;
  authId: string;
  photoUrl?: string;
}

export const signUp = async (user: SignUpUserDto) => {
  const res = await client.post('/auth/signup', user);
  return res.data;
};
