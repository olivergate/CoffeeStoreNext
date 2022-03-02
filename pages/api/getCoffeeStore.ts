import Airtable from 'airtable';
import { NextApiRequest, NextApiResponse } from 'next';
import { CoffeeStore } from '..';
import { ATCoffeeStore } from '../../axios';
import Validator, { ValidationQuery } from '../../validation';
const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_KEY }).base(
  process.env.NEXT_PUBLIC_AIRTABLE_BASE!
);

export interface TNextRequest<T extends {}> extends NextApiRequest {
  body: T;
}

const table = base('coffee-stores');

export interface CreateBody {
  id: string;
  name: string;
  address: string;
  neighbourhood: string;
  voting: 1;
  imgUrl: string;
}

export const findCoffeeStore = async (id: string) =>
  await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();
export interface FindRequest extends Pick<CoffeeStore, 'id'> {}
export interface UpVoteRequest extends Pick<ATCoffeeStore, 'id'>, Pick<CoffeeStore, 'voting'> {}

const validationQuery: ValidationQuery<FindRequest> = {
  id: [{ type: 'Required' }],
};

const getCoffeeStore = async (req: TNextRequest<FindRequest>, res: NextApiResponse) => {
  const { body } = req;
  const validator = new Validator(validationQuery);
  await validator.validate(body);
  if (!validator.getIsValid()) {
    const response = validator
      .getValidationErrors()
      .map(x => x.message)
      .join('. ');
    console.error('Error - ', response);
    res.status(400).json({ message: response });
  } else {
    try {
      const existingCS = await findCoffeeStore(req.body.id);
      if (existingCS.length !== 0) {
        const existingStore = existingCS;
        console.log('Existing store found');
        res.json(existingStore);
      } else res.json(false);
    } catch (e) {
      console.error(e);
      res.status(500).send('WHATTTT');
    }
  }
};

export default getCoffeeStore;
