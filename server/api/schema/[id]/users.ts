import type { VercelRequest, VercelResponse } from '@vercel/node';

import useMiddlewares from '../../../middlewares/useMiddlewares';
import useAuth from '../../../middlewares/auth';
import useCors from '../../../middlewares/cors';
import connectToDatabase from '../../../db';
import { UserSchema } from '../../../models/UserSchema';
import { User } from '../../../models/User';

async function updateSchemaUsers(req: any, res: VercelResponse) {
  try {
    if (req.method === 'POST') {
      await connectToDatabase();
      const id = req.query.id;

      if (!id) {
        return res.status(400).json({
          message: 'No schema ID provided',
        });
      }

      if (!req.body || !req.body.users) {
        return res.status(400).json({
          message: 'No users provided',
        });
      }

      const updatedUsersPromises = req.body.users.map((user) => {
        return User.findOne({ email: user.email }).then((userData) => {
          return {
            ...user,
            name: userData.fullName || null,
          };
        });
      });

      const updatedUsers = await Promise.all(updatedUsersPromises);

      const updatedSchema = await UserSchema.updateOne(
        { id: id },
        {
          $set: {
            users: updatedUsers,
            isPublic: req.body.isPublic || false,
            tables: req.body.schema.tables,
            description: req.body.schema.description,
            title: req.body.schema.title,
            id: req.body.schema.id,
            userId: req.authId,
          },
        },
        { upsert: true }
      );

      return res.status(200).json({
        message: 'Postgres Schema users updated successfully',
        data: updatedSchema,
      });
    }

    return res.status(400).json({
      message: 'Invalid method',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

export default useMiddlewares(useCors, useAuth, updateSchemaUsers);
