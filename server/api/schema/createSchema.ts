import { IUserSchema, UserSchema } from '../../models/UserSchema';

const createSchema = async (schema: IUserSchema) => {
  return await UserSchema.updateOne(
    {
      id: schema.id,
    },
    schema,
    {
      upsert: true,
    }
  );
};

export default createSchema;
