import { TRecipe } from "../Recipes/reducer";

export const initialState = {
  events: {},
  recipes: [],
  isOpen: false,
  position: 0,
  slot: 0,
  search: '',
  highlighted: 0,
  selectedWeek: 0,
  toConfirm: false,
};

export type TEvent = {
  readonly _id: string,
  user: string,
  date: string,
  recipe: string | TRecipe,
  slot: number
};

export type TEvents = { [key: string]: TEvent[] };

type Action = {
  type: 'loadEvents' | 'loadRecipes' | 'open' | 'close' | 'search' | 'highlight' | 'previousWeek' | 'nextWeek' | 'today' | 'setToConfirm',
  value?: string | number | boolean,
  slot?: number,
  data?: TRecipe[] | TEvents,
};

type State = {
  events: TEvents,
  recipes: TRecipe[],
  isOpen: boolean,
  position: number,
  slot: number,
  search: string,
  highlighted: number,
  selectedWeek: number,
  toConfirm: boolean,
};

export const reducer = (state: State, action: Action) : State => {
  const { type, value, slot, data } = action;
  const { recipes, events, selectedWeek } = state;
  switch (type) {
    case 'loadEvents': return { ...state, events: data as TEvents };
    case 'loadRecipes': return { ...state, recipes: data as TRecipe[] };
    case 'open': return { ...state, isOpen: true, position: value as number, slot: slot as number };
    case 'close': return { ...initialState, recipes: recipes, events: events, selectedWeek };
    case 'search': return { ...state, search: value as string };
    case 'highlight': return { ...state, highlighted: value as number };
    case 'previousWeek': return { ...state, selectedWeek: selectedWeek - 1 };
    case 'nextWeek': return { ...state, selectedWeek: selectedWeek + 1 };
    case 'today': return { ...state, selectedWeek: 0 };
    case 'setToConfirm': return { ...state, toConfirm: value as boolean };
    default: return state;
  }
}