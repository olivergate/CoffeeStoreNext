import { FieldSet, Records } from 'airtable';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CoffeeStore, FourSquareVenue } from '../pages';
import { CreateBody } from '../pages/api/createCoffeeStore';
import { FindRequest } from '../pages/api/getCoffeeStore';
import { Data } from '../pages/api/getCoffeeStoresByLocation';
import { fourSVToCS } from '../pages/coffee-store/[id]';

// Todo Type the process.env
export const fsq_api = axios.create({
  baseURL: 'https://api.foursquare.com/v3/',
  headers: {
    Accept: 'application/json',
    Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY!,
  },
});

export const api = axios.create({
  baseURL: '/api/',
  headers: {
    Accept: 'application/json',
  },
});

interface FSQResult<T> {
  results: T[];
}

interface FourSquareImage {
  id: string;
  created_at: string;
  prefix: string;
  suffix: string;
  width: number;
  height: number;
  classifications: string[];
}

export interface StoreImage {
  fsq_id: string;
  photo: string;
}

export interface ATCoffeeStore extends FieldSet, CoffeeStore {}

export const createATcoffeeStore = (payload: CreateBody) =>
  api.post<CreateBody, AxiosResponse<Records<ATCoffeeStore>>>('/createCoffeeStore', payload);
export const findAtCoffeeStore = (payload: FindRequest) =>
  api.post<FindRequest, AxiosResponse<Records<ATCoffeeStore>>>('/getCoffeeStore', payload).then(x => x.data[0]);
export const upVote = (payload: FindRequest) =>
  api.post<FindRequest, AxiosResponse<Records<ATCoffeeStore>>>('/incrementScore', payload).then(x => x.data);

export const fsq_get = <T>(url: string, params: any, axiosConfig?: AxiosRequestConfig) =>
  fsq_api.get<T>(url, { params, ...axiosConfig }).then(x => x.data);

export const getNearby = async (latlong: string, query: string, limit = 6) => {
  const venues = await fsq_get<FSQResult<FourSquareVenue>>('places/nearby', {
    ll: latlong,
    v: '20220220',
    query,
    limit,
  });
  const photos = await getPhotos(venues.results.map(x => x.fsq_id));
  return venues.results
    .map<FourSquareVenue>(venue => ({
      ...venue,
      photo: photos.find(photo => photo.fsq_id === venue.fsq_id)?.photo || defaultPhoto,
    }))
    .map(x => fourSVToCS(x));
};
export const defaultPhoto =
  'https://fastly.4sqi.net/img/general/200x200/1049719_PiLE0Meoa27AkuLvSaNwcvswnmYRa0vxLQkOrpgMlwk.jpg';

export const getPhoto = (fsq_id: string, limit = 1): Promise<StoreImage> =>
  fsq_get<FourSquareImage[]>(`places/${fsq_id}/photos`, { limit, fsq_id }).then(x => ({
    fsq_id,
    photo: x.length > 0 ? x[0].prefix + 'original' + x[0].suffix : defaultPhoto,
  }));

export const getPhotos = (ids: string[]) => Promise.all(ids.map(x => getPhoto(x)));

export const getCoffeeStores = (latlong: string, limit = 6) =>
  api.get<Data>('getCoffeeStoresByLocation', {
    params: {
      latlong,
      limit,
    },
  });
