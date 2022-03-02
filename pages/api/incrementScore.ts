import Airtable from 'airtable';
import { NextApiRequest, NextApiResponse } from 'next';
import { CoffeeStore } from '..';
import { ATCoffeeStore } from '../../axios';
import Validator, { ValidationQuery } from '../../validation';
import { findCoffeeStore, FindRequest, UpVoteRequest } from './getCoffeeStore';
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
  voting: number;
  imgUrl: string;
}

const upVote = async (id: string, voting: number) => await table.update(id, { voting });

const validationQuery: ValidationQuery<FindRequest> = {
  id: [{ type: 'Required' }],
};

const incrementScore = async (req: TNextRequest<FindRequest>, res: NextApiResponse) => {
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
      const coffeeStore = await findCoffeeStore(req.body.id);
      if (coffeeStore) {
        const result = await upVote(coffeeStore[0].id, (coffeeStore[0].fields as ATCoffeeStore).voting + 1);
        console.log('Upvoted');
        res.status(200).json(result);
      } else {
        res.status(400).json({ message: "Coffee store doesn't exist in table" });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error incrementing score' + e });
    }
  }
};

export default incrementScore;
