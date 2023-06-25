import type { VercelRequest, VercelResponse } from '@vercel/node';

import useMiddlewares from '../../../middlewares/useMiddlewares';
import useAuth from '../../../middlewares/auth';
import useCors from '../../../middlewares/cors';
import connectToDatabase from '../../../db';
import { UserSchema } from '../../../models/UserSchema';

async function deleteSchema(req: any, res: VercelResponse) {
  try {
    if (req.method === 'DELETE') {
      await connectToDatabase();
      const id = req.query.id;

      if (!id) {
        return res.status(400).json({
          message: 'No schema ID provided',
        });
      }

      const schema = await UserSchema.findOne({ id: id });

      if (!schema) {
        return res.status(200).json({
          message: 'Schema not found in db',
        });
      }

      if (schema.userId !== req.authId) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      await UserSchema.deleteOne({ id: id });

      return res.status(200).json({
        message: 'Schema deleted successfully',
        data: {
          deleted: true,
        },
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

export default useMiddlewares(useCors, useAuth, deleteSchema);
