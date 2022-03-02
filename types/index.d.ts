export interface CoffeeStore {
  id: string;
  name: string;
  address: string;
  neighbourhood: string;
  voting: 0;
  imgUrl: string;
}

export interface CreateBody extends CoffeeStore {}

export interface TNextRequest<T extends {}> extends NextApiRequest {
  body: T;
}

export interface StoreImage {
  fsq_id: string;
  photo: string;
}

export interface FourSquareVenue {
  fsq_id: string;
  categories: {
    id: number;
    name: string;
    icon: {
      prefix: string;
      suffix: string;
    };
  }[];
  chains: any[];
  distance: number;
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
  location: {
    address: string;
    country: string;
    cross_street: string;
    dma: string;
    formatted_address: string;
    locality: string;
    neighborhood: string;
    postcode: string;
    region: string;
  };
  name: string;
  related_places: {};
  timezone: string;
  photo: string;
}

export interface FourSquareImage {
  id: string;
  created_at: string;
  prefix: string;
  suffix: string;
  width: number;
  height: number;
  classifications: string[];
}
