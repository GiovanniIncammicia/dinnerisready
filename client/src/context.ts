import { createContext, useContext, Dispatch } from 'react';
export const initialState = {
  loading: false,
  user: null,
};

type Action = {
  type: 'toggleLoading' | 'setUser',
  data?: any,
};

type State = {
  loading: boolean,
  user: any
};

type Context = {
  state: State,
  dispatch: Dispatch<any>
}

const GlobalContext = createContext<Context>({ state: initialState, dispatch: () => null });
export const Provider = GlobalContext.Provider;

export const reducer = (state: State, action: Action) : State => {
  switch(action.type) {
    case 'toggleLoading': return { ...state, loading: !state.loading };
    case 'setUser': return { ...state, user: action.data }
    default: return state;
  }
}

export const useGlobalContext = (): [State, Dispatch<any>] => {
  const { state, dispatch } = useContext(GlobalContext);
  return [state, dispatch];
}