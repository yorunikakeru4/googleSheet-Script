import type { NextApiRequest, NextApiResponse } from 'next';
import { updateBike, getBikes } from '../../../utils/googleSheets';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const { status, user } = req.body;
      if (!status) {
        res.status(400).json({ error: 'Missing status' });
        return;
      }
      await updateBike(String(id), { status, user });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
    return;
  }

  if (req.method === 'GET') {
    try {
      const bikes = await getBikes();
      const bike = bikes.find(b => b.id === String(id));
      if (!bike) {
        res.status(404).json({ error: 'Bike not found' });
        return;
      }
      res.status(200).json(bike);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
    return;
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
