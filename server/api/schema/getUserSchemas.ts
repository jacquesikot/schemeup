import { User } from '../../models/User';
import { UserSchema } from '../../models/UserSchema';

const getUserSchemas = async (userId: string) => {
  const user = await User.findOne({ authId: userId });

  const schemas = await UserSchema.find({
    $or: [
      { 'users.email': user.email }, // matches schemas where a user with the given email exists in 'users' array
      { email: user.email }, // matches schemas where the email property equals the given email
    ],
  });

  return schemas;
};

export default getUserSchemas;
