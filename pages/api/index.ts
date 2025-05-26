import type { NextApiRequest, NextApiResponse } from 'next';
import { getBikes } from '../../utils/googleSheets';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const bikes = await getBikes();
      res.json(bikes);
    } catch (e) {
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  } else {
    res.status(405).end();
  }
}
