import { flags } from "../../utility/constants";

const emptyRecipe = {
  "_id": "newRecipe",
  "flags": 0,
  "user": "",
  "name": "",
  "time": 0,
  "serves": 1,
  "ingredients": [],
  "steps": []
};

export type TStep = {
  // TODO: perché non riesco a mettere "chop" | "prep" | "cook" ? forse perché bisogna usare keyof typeof TWorkstation?
  workstation: string,
  text: string,
  slot: number,
  readonly _id: string
};
export type TIngredient = {
  ingredient: {
    names: string[],
    unit: string
  },
  qty: string,
  readonly _id: string
};

export type TRecipe = {
  readonly _id: string,
	user: string,
	name: string,
	time: number,
	picture?: string,
	ingredients: TIngredient[],
	steps: TStep[],
	serves: number,
	meal?: string,
  flags: number,
  last?: number,
};

export const initialState = {
  recipes: [],
  selected: 0,
  modified: false,
  search: ''
};

type Action = {
  type: 'select' | 'load' | 'change' | 'delete' | 'save' | 'create' | 'search',
  index?: number,
  name?: string,
  value?: string,
  slot?: number,
  workstation?: string,
  data?: object,
  input?: string,
  i?: number,
};

type StepAction = { value: string, slot: number, workstation: string };
type IngredientAction = { value: string, input: string, i: number };

type State = {
  recipes: TRecipe[],
  selected: number,
  modified: boolean,
  search: string
};

const stepsReducer = (steps: TStep[], action: StepAction) => {
  const { value, slot, workstation } = action;
  const i = steps.findIndex(s => s.slot === slot && s.workstation === workstation);
  const createId = (s: number, w: string) => `newStep_${s}_${w}`;
  
  if (i < 0) return [...steps, { workstation, text: value, slot, _id: createId(slot, workstation) }]; // crea
  else if (value) return [...steps.slice(0, i), { ...steps[i], text: value }, ...steps.slice(i + 1, steps.length)]; // modifica
  else {
    const current = steps[i].slot;
    const cutArray = [...steps.slice(0, i), ...steps.slice(i + 1, steps.length)];
    const areThereGreaterSlots = steps.some(s => s.slot > current);
    const areTherePairSlots = cutArray.some(s => s.slot === current);
    
    if (areThereGreaterSlots && !areTherePairSlots)
      return cutArray.map(s => s.slot > current ? ({ ...s, slot: s.slot - 1, _id: s._id.startsWith('newStep') ? createId(s.slot - 1, s.workstation) : s._id }) : s); // decrementa
    else return cutArray; // elimina
  }
}

const ingredientsReducer = (ingredients: TIngredient[], action: IngredientAction) => {
  const { value, input, i } = action;
  const newIngredient = { ...(ingredients[i] ?? { _id: `newIngredient_${i}`, qty: '', ingredient: { unit: '', names: [] }}) };
  switch (input) {
    case 'delete':
      newIngredient.qty = "";
      newIngredient.ingredient = { unit: "", names: [] };
      break;
    case 'qty':
      newIngredient.qty = value; break;
    case 'unit':
      newIngredient.ingredient.unit = value; break;
    case 'names':
      newIngredient.ingredient.names = [value]; break;
    default: break;
  }
  if (!newIngredient.qty && !newIngredient.ingredient.unit && !newIngredient.ingredient.names[0])
    return [...ingredients.slice(0, i), ...ingredients.slice(i + 1, ingredients.length)]; // elimina
  return [...ingredients.slice(0, i), newIngredient, ...ingredients.slice(i + 1, ingredients.length)]; // crea o modifica
}

const recipeReducer = (recipes: TRecipe[], action: Action) => {
  const { index, name, value, type } = action;
  
  switch (type) {
    case 'delete': return recipes.filter((_, i) => i !== index );
    case 'create': return recipes.concat({ ...emptyRecipe, user: value as string });
    case 'search': return recipes.filter(r => r.name.toLowerCase().includes(value?.toLowerCase() as string));
    default: switch (name) {
      case 'flags':
        return recipes.map((r, i) => i === index ? ({ ...r, [name as string]: r.flags ^ flags[value as string] }) : r);
      case 'steps':
        return recipes.map((r, i) => i === index ? ({ ...r, steps: stepsReducer(r.steps, action as StepAction) }) : r);
      case 'ingredients':
        return recipes.map((r, i) => i === index ? ({ ...r, ingredients: ingredientsReducer(r.ingredients, action as IngredientAction) }) : r);
      default:
        return recipes.map((r, i) => i === index ? ({ ...r, [name as string]: value }) : r);
    }
  }
}

export const reducer = (state: State, action: Action) : State => {
  const { type, index, data, value } = action;
  const { selected, recipes } = state;
  const afterDeleteIndex = () => selected < (index as number) ? selected : Math.max(Math.min((selected - 1), recipes.length), 0);
  const afterCancelIndex = () => selected < (recipes.length - 1) ? selected : Math.max(selected - 1, 0);
  switch(type) {
    case 'select':
      return { ...state, selected: (index as number) };
    case 'load':
      return { ...state, ...data, modified: false, selected: afterCancelIndex()  };
    case 'change':
      return { ...state, recipes: recipeReducer(recipes, action), modified: true };
    case 'delete':
      return { ...state, recipes: recipeReducer(recipes, action), selected: afterDeleteIndex() };
    case 'create':
      return { ...state, recipes: recipeReducer(recipes, action), selected: recipes.length, modified: true };
    case 'search':
      return { ...state, recipes: recipeReducer((data as { recipes: TRecipe[] }).recipes, action), search: value as string };
    case 'save':
      return { ...state, recipes: [...recipes.slice(0, index), (data as TRecipe), ...recipes.slice((index as number) + 1)], modified: false };
    default: return state;
  }
}