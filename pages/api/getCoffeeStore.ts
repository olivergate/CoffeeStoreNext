import Airtable from 'airtable';
import { AirtableBase } from 'airtable/lib/airtable_base';
import { NextApiResponse } from 'next';
import { findCoffeeStoreAT } from '../../axios/airtable';
import { FindRequest } from '../../axios/serverApi';
import { CoffeeStore, TNextRequest } from '../../types';
import Validator, { ValidationQuery } from '../../validation';

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
      const existingCS = await findCoffeeStoreAT(req.body.id);
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
