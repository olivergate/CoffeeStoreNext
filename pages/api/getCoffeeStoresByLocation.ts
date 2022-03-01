// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { FourSquareVenue } from '..';
import { getNearby } from '../../axios';

export type Data = {
  coffeeStores: FourSquareVenue[];
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    // get latLong
    const { latlong, limit } = req.query;

    const coffeeStores = await getNearby(latlong as string, 'coffee stores', Number(limit));
    console.log({ coffeeStores });
    res.status(200).json({ coffeeStores });
  } catch (error) {
    console.error('', error);
    res.status(500);
  }
};

export default handler;
