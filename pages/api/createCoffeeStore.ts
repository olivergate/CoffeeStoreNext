import Airtable from 'airtable';
import { NextApiRequest, NextApiResponse } from 'next';
import Validator, { ValidationQuery } from '../../validation';
const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_KEY }).base(
  process.env.NEXT_PUBLIC_AIRTABLE_BASE!
);

export interface TNextRequest<T extends {}> extends NextApiRequest {
  body: T;
}

const table = base('coffee-stores');

interface CreateBody {
  id: string;
  name: string;
  address: string;
  neighbourhood: string;
  voting: 1;
  imgUrl: string;
}

const findCoffeeStore = async (id: string) =>
  await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

const addCoffeeStoreToDb = async (body: CreateBody) => {
  return await table.create([{ fields: { ...body } }]);
};

const validationQuery: ValidationQuery<CreateBody> = {
  id: [{ type: 'Required' }],
  name: [{ type: 'Required' }],
};

const createCoffeeStore = async (req: TNextRequest<CreateBody>, res: NextApiResponse) => {
  const { body } = req;
  const validator = new Validator(validationQuery);
  await validator.validate(body);
  if (!validator.getIsValid()) {
    const response = validator
      .getValidationErrors()
      .map(x => x.message)
      .join('. ');
    console.log('Error - ', response);
    res.status(400).json({ message: response });
  } else {
    try {
      const existingCS = await findCoffeeStore(req.body.id);
      if (existingCS.length !== 0) {
        const existingStore = existingCS.map(x => x.fields)[0];
        console.log('Existing store found', existingStore);
        res.json(existingStore);
      } else {
        const newStore = await addCoffeeStoreToDb(req.body);
        console.log('New store created', newStore);
        res.json({ newStore });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send('WHATTTT');
    }
  }
};

export default createCoffeeStore;
