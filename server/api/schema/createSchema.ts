import { IUserSchema, UserSchema } from '../../models/UserSchema';

const createSchema = async (schema: IUserSchema) => {
  await UserSchema.updateOne(
    {
      id: schema.id,
    },
    schema,
    {
      upsert: true,
      returnDocument: 'after',
    }
  );

  return UserSchema.findOne({
    id: schema.id,
  });
};

export default createSchema;
