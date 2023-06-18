import type { VercelRequest, VercelResponse } from '@vercel/node';
import connectToDatabase from '../../db';
import { User, validateUser } from '../../models/User';
import useMiddlewares from '../../middlewares/useMiddlewares';
import useCors from '../../middlewares/cors';

async function signup(req: VercelRequest, res: VercelResponse) {
  await connectToDatabase();
  const validationError = validateUser(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError.message });
  }

  const userExists = await User.findOne({
    $or: [{ email: req.body.email }, { authId: req.body.authId }],
  });

  if (userExists) {
    return res.status(200).json({ error: 'User already exists allowance' });
  }

  const user = await User.create({
    fullName: req.body.fullName,
    email: req.body.email,
    authId: req.body.authId,
  });

  res.status(200).json({
    message: 'User created successfully',
    data: user,
  });
}

export default useMiddlewares(useCors, signup);
