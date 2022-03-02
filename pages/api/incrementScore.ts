import { NextApiResponse } from 'next';
import { findCoffeeStoreAT, upVoteAT } from '../../axios/airtable';
import { AirtableCoffeeStore, FindRequest } from '../../axios/serverApi';
import { TNextRequest } from '../../types';
import Validator, { ValidationQuery } from '../../validation';

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
      const coffeeStore = await findCoffeeStoreAT(req.body.id);
      if (coffeeStore) {
        const result = await upVoteAT(coffeeStore[0].id, (coffeeStore[0].fields as AirtableCoffeeStore).voting + 1);
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
