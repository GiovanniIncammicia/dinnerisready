import { flags } from "./constants";
import { TEvents, TEvent } from '../components/Calendar/reducer';
import { TRecipe } from "../components/Recipes/reducer";

export const isEmptyObject = function (obj: object) {
  for (let n in obj) return false;
  return true;
};

export const extractFlags = (mask: number):string[] => Object.keys(flags).reduce((acc: string[], k) => (mask & flags[k]) ? [...acc, k] : acc, []);

export const capitalize = (s: string) => s.replace(/^\w/, c => c.toUpperCase());

export const getNumericEnumFields = (enumType: any): string[] => Object.keys(enumType).filter(v => !isNaN(Number(v))).map((key: string) => enumType[key as keyof typeof enumType]);

export const formatDate = (date: Date) => (new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))).toISOString().slice(0, 10);

export const compareDates = (day: string, month: string, year: string, date = new Date()) => `${year}-${month}-${day}` === formatDate(date);

const checkNutrition = (plan: TRecipe[]) => {
  const nutrition = { CARBS: 0, PROTEINS: 0, VEGGIES: 0 };
  plan.forEach(r => {
    if (r.flags & flags.CARBS) nutrition.CARBS++;
    if (r.flags & flags.PROTEINS) nutrition.PROTEINS++;
    if (r.flags & flags.VEGGIES) nutrition.VEGGIES++;
  });
  return nutrition;
}

const getPlanNutrition = (plan: TEvent[], slot: number) => {
  let nutrition = { CARBS: 0, PROTEINS: 0, VEGGIES: 0 };
  if (plan) {
    const slotRecipes = plan.filter(r => r.slot === slot).map(r => r.recipe as TRecipe);
    if (slotRecipes.length > 0) nutrition = checkNutrition(slotRecipes);
  }
  return nutrition;
}

export const generateMealPlan = (plan: TEvents, week: string[], recipes: TRecipe[], user: string) => {
  const breakfastRecipes = recipes.filter(r => r.meal === 'breakfast');
  const mainRecipes = recipes.filter(r => r.meal === 'main');
  let newPlan: TEvents = {};
  const createEvent = (slot: number, date: string) => (recipe: TRecipe, i: number) => ({ _id: `generateMealPlan_slot${slot}${date}${i}`, recipe, user, slot, date })
  for (let date of week) {
    newPlan[date] = [];
    newPlan[date] = chooseRecipes(plan[date], breakfastRecipes, 0).map(createEvent(0, date));
    // TODO: slot 1 (scegliere ricette dal giorno prima)
    // newPlan[date] = [ ...newPlan[date], ...chooseLunchRecipes(plan[date], mainRecipes) ];
    newPlan[date].push(...chooseRecipes(plan[date], mainRecipes, 2).map(createEvent(2, date)));
  }
  return newPlan;
}

const chooseRecipes = (plan: TEvent[], recipes: TRecipe[], slot: number) => {
  const { CARBS, PROTEINS, VEGGIES } = getPlanNutrition(plan, slot);

  const allThreeNutrient = recipes.filter(r => (r.flags & flags.CARBS) && (r.flags & flags.PROTEINS) && (r.flags & flags.VEGGIES));
  const carbsProteins = recipes.filter(r => (r.flags & flags.CARBS) && (r.flags & flags.PROTEINS) && !(r.flags & flags.VEGGIES));
  const carbsVeggies = recipes.filter(r => (r.flags & flags.CARBS) && !(r.flags & flags.PROTEINS) && (r.flags & flags.VEGGIES));
  const proteinsVeggies = recipes.filter(r => !(r.flags & flags.CARBS) && (r.flags & flags.PROTEINS) && (r.flags & flags.VEGGIES));
  const carbs = recipes.filter(r => (r.flags & flags.CARBS) && !(r.flags & flags.PROTEINS) && !(r.flags & flags.VEGGIES));
  const proteins = recipes.filter(r => !(r.flags & flags.CARBS) && (r.flags & flags.PROTEINS) && !(r.flags & flags.VEGGIES));
  const veggies = recipes.filter(r => !(r.flags & flags.CARBS) && !(r.flags & flags.PROTEINS) && (r.flags & flags.VEGGIES));

  const array: TRecipe[] = [];

  if (!CARBS && !PROTEINS && !VEGGIES) {
    if (allThreeNutrient.length > 0) return [pickBestRecipe(allThreeNutrient)];
    else {
      if (carbsProteins.length > 0 && veggies.length > 0) return [pickBestRecipe(carbsProteins), pickBestRecipe(veggies)];
      if (carbsVeggies.length > 0 && proteins.length > 0) return [pickBestRecipe(carbsVeggies), pickBestRecipe(proteins)];
      if (proteinsVeggies.length > 0 && carbs.length > 0) return [pickBestRecipe(proteinsVeggies), pickBestRecipe(carbs)];
      if (proteinsVeggies.length > 0) return [pickBestRecipe(proteinsVeggies)];
      if (carbsProteins.length > 0) return [pickBestRecipe(carbsProteins)];
      if (carbsVeggies.length > 0) return [pickBestRecipe(carbsVeggies)];
      if (carbs.length > 0) array.push(pickBestRecipe(carbs));
      if (proteins.length > 0) array.push(pickBestRecipe(proteins));
      if (veggies.length > 0) array.push(pickBestRecipe(veggies));
    }
  } else if (!CARBS && !PROTEINS) {
    if (carbsProteins.length > 0) return [pickBestRecipe(carbsProteins)];
    if (carbs.length > 0) array.push(pickBestRecipe(carbs));
    if (proteins.length > 0) array.push(pickBestRecipe(proteins));
  }
  else if (!CARBS && !VEGGIES) {
    if (carbsVeggies.length > 0) return [pickBestRecipe(carbsVeggies)];
    if (carbs.length > 0) array.push(pickBestRecipe(carbs));
    if (veggies.length > 0) array.push(pickBestRecipe(veggies));
  }
  else if (!PROTEINS && !VEGGIES) {
    if (proteinsVeggies.length > 0) return [pickBestRecipe(proteinsVeggies)];
    if (proteins.length > 0) array.push(pickBestRecipe(proteins));
    if (veggies.length > 0) array.push(pickBestRecipe(veggies));
  }
  else if (!CARBS && carbs.length > 0) return [pickBestRecipe(carbs)];
  else if (!PROTEINS && proteins.length > 0) return [pickBestRecipe(proteins)];
  else if (!VEGGIES && veggies.length > 0) return [pickBestRecipe(veggies)];
  return array;
}

const pickBestRecipe = (recipes: TRecipe[]) => {
  // TODO: scegli la ricetta con valore di lastEaten più vecchio
  const timeSorted = recipes.sort((a, b) => a.time - b.time);
  return timeSorted[0];
}