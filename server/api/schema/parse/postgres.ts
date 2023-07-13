import type { VercelRequest, VercelResponse } from '@vercel/node';

import useMiddlewares from '../../../middlewares/useMiddlewares';
import useAuth from '../../../middlewares/auth';
import useCors from '../../../middlewares/cors';
import parsePgDumpParser from '../../../lib/parsers/pgDumpParserO';
import { postgreAiSqlParser } from '../../../lib/parsers/aiPgDumpParser';

async function parsePgDump(req: VercelRequest, res: VercelResponse) {
  const sql = req.body;

  if (!req.body) {
    return res.status(400).json({
      message: 'No SQL provided',
    });
  }

  const data = await postgreAiSqlParser(sql);

  res.status(200).json({
    message: 'Postgres Schema parsed successfully',
    data,
  });
}

export default useMiddlewares(useCors, useAuth, parsePgDump);
