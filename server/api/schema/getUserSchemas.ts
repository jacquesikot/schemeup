import { UserSchema } from '../../models/UserSchema';

const getUserSchemas = async (userId: string) => {
  const schemas = await UserSchema.find({ userId });
  return schemas;
};

export default getUserSchemas;
