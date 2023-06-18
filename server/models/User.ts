import mongoose from 'mongoose';

interface IUser {
  fullName: string;
  email: string;
  authId?: string;
}

interface UserModelInterface extends mongoose.Model<any> {
  build(attr: IUser): any;
}

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    authId: {
      type: String,
      required: true,
      unique: true,
    },
    photoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

const User = mongoose.model<any, UserModelInterface>('User', UserSchema);

const validateUser = (user: IUser) => {
  const newUser = new User(user);
  const validationError = newUser.validateSync();
  return validationError;
};
export { User, validateUser };
