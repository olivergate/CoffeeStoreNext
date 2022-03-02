// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getNearby } from '../../axios/foursqaure';
import { CoffeeStore } from '../../types';

export type Data = {
  coffeeStores: CoffeeStore[];
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    // get latLong
    const { latlong, limit } = req.query;

    const coffeeStores = await getNearby(latlong as string, 'coffee stores', Number(limit));
    console.log('Coffee stores succesfully fetched');
    res.status(200).json({ coffeeStores });
  } catch (error) {
    console.error('', error);
    res.status(500);
  }
};

export default handler;
