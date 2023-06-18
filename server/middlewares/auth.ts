import { connect } from 'http2';
import { User } from '../models/User';
import connectToDatabase from '../db';

export const useAuth = async (req: any, res) => {
  await connectToDatabase();
  const userId = req.headers['x-auth-id'];

  if (!userId) {
    return res.status(401).json({ message: 'Invalid user.' });
  }

  const userFound = await User.findOne({ authId: userId });

  if (!userFound) {
    return res.status(401).json({ message: 'Invalid user.' });
  }

  req.authId = userFound.authId;
};

export default useAuth;
