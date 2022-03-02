import { FieldSet, Records } from 'airtable';
import axios, { AxiosResponse } from 'axios';

import { Data } from '../pages/api/getCoffeeStoresByLocation';
import { CoffeeStore, CreateBody } from '../types';

export const api = axios.create({
  baseURL: '/api/',
  headers: {
    Accept: 'application/json',
  },
});

export interface AirtableCoffeeStore extends CoffeeStore, FieldSet {}

export interface FindRequest extends Pick<CoffeeStore, 'id'> {}

export interface UpVoteRequest extends Pick<Records<AirtableCoffeeStore>[number], 'id'>, Pick<CoffeeStore, 'voting'> {}

export const createATcoffeeStore = (payload: CreateBody) =>
  api.post<CreateBody, AxiosResponse<Records<AirtableCoffeeStore>>>('/createCoffeeStore', payload);

export const findAtCoffeeStore = (payload: FindRequest) =>
  api.post<FindRequest, AxiosResponse<Records<AirtableCoffeeStore>>>('/getCoffeeStore', payload).then(x => x.data[0]);

export const upVote = (payload: FindRequest) =>
  api.post<FindRequest, AxiosResponse<Records<AirtableCoffeeStore>>>('/incrementScore', payload).then(x => x.data);

export const getCoffeeStores = (latlong: string, limit = 6) =>
  api.get<Data>('getCoffeeStoresByLocation', {
    params: {
      latlong,
      limit,
    },
  });
