import { IUserSchema, UserSchema } from '../../models/UserSchema';

const createSchema = async (schema: IUserSchema) => {
  return await UserSchema.create(schema);
};

export default createSchema;
