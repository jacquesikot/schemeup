import { VercelRequest, VercelResponse } from '@vercel/node';

import connectToDatabase from '../../db';
import { User } from '../../models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  await connectToDatabase();

  const user = await User.findById(id);

  res.status(200).json({
    message: 'User fetched successfully',
    data: user,
  });
}
