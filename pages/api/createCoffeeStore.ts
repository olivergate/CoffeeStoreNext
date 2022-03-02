import Airtable from 'airtable';
import { NextApiResponse } from 'next';
import { addCoffeeStoreAT, findCoffeeStoreAT } from '../../axios/airtable';
import { CreateBody, TNextRequest } from '../../types';
import Validator, { ValidationQuery } from '../../validation';

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
      const existingCS = await findCoffeeStoreAT(req.body.id);
      if (existingCS.length !== 0) {
        const existingStore = existingCS[0];
        console.log('Existing store found');
        res.json(existingStore);
      } else {
        const newStore = await addCoffeeStoreAT(req.body);
        console.log('New store created');
        res.json({ newStore });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send('WHATTTT');
    }
  }
};

export default createCoffeeStore;
