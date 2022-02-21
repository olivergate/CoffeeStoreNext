import axios, { AxiosRequestConfig } from 'axios';
import { CoffeeStore as FourSquareVenue } from '../pages';

export const fsq_api = axios.create({
  baseURL: 'https://api.foursquare.com/v3/',
  headers: {
    Accept: 'application/json',
    Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
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

export const fsq_get = <T>(url: string, params: any, axiosConfig?: AxiosRequestConfig) =>
  fsq_api.get<T>(url, { params, ...axiosConfig }).then(x => x.data);

export const getNearby = (latlong: string, query: string, limit = 6) =>
  fsq_get<FSQResult<FourSquareVenue>>('places/nearby', {
    ll: latlong,
    v: '20220220',
    query,
    limit,
  });
// places/{fsq_id}/photos
const defaultPhoto =
  'https://fastly.4sqi.net/img/general/200x200/1049719_PiLE0Meoa27AkuLvSaNwcvswnmYRa0vxLQkOrpgMlwk.jpg';

export const getPhoto = (fsq_id: string, limit = 1): Promise<StoreImage> =>
  fsq_get<FourSquareImage[]>(`places/${fsq_id}/photos`, { limit, fsq_id }).then(x => ({
    fsq_id,
    photo: x.length > 0 ? x[0].prefix + 'original' + x[0].suffix : defaultPhoto,
  }));

export const getPhotos = (ids: string[]) => Promise.all(ids.map(x => getPhoto(x)));
