import Airtable from 'airtable';
import { CreateBody } from '../types';

const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_KEY }).base(
  process.env.NEXT_PUBLIC_AIRTABLE_BASE!
);

const table = base('coffee-stores');

export const findCoffeeStoreAT = async (id: string) =>
  await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

export const addCoffeeStoreAT = async (body: CreateBody) => {
  return await table.create([{ fields: { ...body } }]);
};

export const upVoteAT = async (id: string, voting: number) => await table.update(id, { voting });
