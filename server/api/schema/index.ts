import { VercelRequest, VercelResponse } from '@vercel/node';

import connectToDatabase from '../../db';
import createSchema from './createSchema';
import { validateUserSchema } from '../../models/UserSchema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectToDatabase();

  if (req.method === 'POST') {
    const validationError = validateUserSchema(req.body);

    if (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    const schema = await createSchema(req.body);
    return res.status(200).json({
      message: 'Schema created successfully',
      data: schema,
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
