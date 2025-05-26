import type { NextApiRequest, NextApiResponse } from 'next';
import { appendLog } from '../../utils/googleSheets';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { date, status, id, brand, user } = req.body;
  if (!date || !status || !id || !brand || typeof user === 'undefined') {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await appendLog({ date, status, id, brand, user });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка при добавлении лога:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
