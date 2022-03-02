import axios, { AxiosRequestConfig } from 'axios';
import { CoffeeStore, FourSquareImage, FourSquareVenue, StoreImage } from '../types';

interface FSQResult<T> {
  results: T[];
}

// Todo Type the process.env
export const fsq_api = axios.create({
  baseURL: 'https://api.foursquare.com/v3/',
  headers: {
    Accept: 'application/json',
    Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY!,
  },
});

const extractFromArray = (value: string | string[]): string => {
  if (typeof value === 'string') {
    return value;
  }
  return value.join(' ');
};

export const fourSVToCS = (venue: FourSquareVenue): CoffeeStore => ({
  address: venue.location.address,
  id: venue.fsq_id,
  imgUrl: venue.photo,
  name: venue.name,
  neighbourhood: extractFromArray(venue.location.neighborhood || venue.location.cross_street || ''),
  voting: 0,
});

export const fsq_get = <T>(url: string, params: any, axiosConfig?: AxiosRequestConfig) =>
  fsq_api.get<T>(url, { params, ...axiosConfig }).then(x => x.data);

export const getPhotos = (ids: string[]) => Promise.all(ids.map(x => getPhoto(x)));

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
