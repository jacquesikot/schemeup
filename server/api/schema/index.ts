import { VercelResponse } from '@vercel/node';

import connectToDatabase from '../../db';
import createSchema from './createSchema';
import getUserSchemas from './getUserSchemas';
import { validateUserSchema } from '../../models/UserSchema';
import useMiddlewares from '../../middlewares/useMiddlewares';
import useCors from '../../middlewares/cors';
import useAuth from '../../middlewares/auth';

async function handler(req: any, res: VercelResponse) {
  await connectToDatabase();

  if (req.method === 'POST') {
    const validationError = validateUserSchema({
      id: req.body.id,
      description: req.body.description,
      userId: req.authId,
      users: req.body.users,
      title: req.body.title,
      tables: req.body.tables,
    });

    if (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    const schema = await createSchema({
      id: req.body.id,
      description: req.body.description,
      userId: req.body.userId ? req.body.userId : req.authId,
      users: req.body.users,
      title: req.body.title,
      tables: req.body.tables,
    });
    return res.status(200).json({
      message: 'Schema created successfully',
      data: schema,
    });
  }

  if (req.method === 'GET') {
    const schemas = await getUserSchemas(req.authId);

    return res.status(200).json({
      message: 'Schema fetched successfully',
      data: schemas,
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export default useMiddlewares(useCors, useAuth, handler);
