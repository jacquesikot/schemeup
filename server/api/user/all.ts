import { VercelRequest, VercelResponse } from '@vercel/node';

import connectToDatabase from '../../db';
import { User } from '../../models/User';
import useMiddlewares from '../../middlewares/useMiddlewares';
import useCors from '../../middlewares/cors';
import useAuth from '../../middlewares/auth';

async function handler(req: VercelRequest, res: VercelResponse) {
  await connectToDatabase();

  const user = await User.find();

  res.status(200).json({
    message: 'Users fetched successfully',
    data: user,
  });
}

export default useMiddlewares(useCors, useAuth, handler);
