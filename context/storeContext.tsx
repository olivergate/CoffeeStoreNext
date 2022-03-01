import { createContext, useReducer } from 'react';
import { FourSquareVenue } from '../pages';

interface State {
  latlong: string;
  localStores: FourSquareVenue[];
}

type SET_COFFEE_STORES = 'SET_COFFEE_STORES';
type SET_LATLONG = 'SET_LATLONG';

type ActionsTypes = SET_COFFEE_STORES | SET_LATLONG;

interface BaseAction {
  type: ActionsTypes;
}

interface SetCoffeeStoreAction extends BaseAction {
  type: 'SET_COFFEE_STORES';
  payload: FourSquareVenue[];
}

interface SetLatLongAction extends BaseAction {
  type: 'SET_LATLONG';
  payload: string;
}

type Action = SetCoffeeStoreAction | SetLatLongAction;
type Reducer = typeof reducer;
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_COFFEE_STORES': {
      return { ...state, localStores: action.payload };
    }
    case 'SET_LATLONG': {
      return { ...state, latlong: action.payload };
    }
    default: {
      return state;
    }
  }
};

interface ContextState {
  state: State;
  dispatch?: React.Dispatch<Action>;
}

export const StoreContext = createContext<ContextState>({ state: { localStores: [], latlong: '' } });
export const StoreProvider: React.FC = ({ children }) => {
  const initialState: State = { localStores: [], latlong: '' };
  const [state, dispatch] = useReducer<Reducer>(reducer, initialState);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};
