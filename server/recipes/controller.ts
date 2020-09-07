// Controllers are responsible for reading and manipulating the request, calling the daos and create and send the response
// They are the gate between the clients and the server
import { Request, Response, NextFunction} from 'express';
import * as dao from './dao';
import * as ingredientDao from '../ingredients/dao';
import * as calendarDao from '../calendar/dao';
import { OK } from '../utility/httpStatusCodes';
import { handleError } from '../utility/errorHandler';
import { isObjectIdValid } from '../utility/functions';

const elaborateRecipeBody = async (body: any) => {
  type TBodyIngredient = { _id: string, ingredient: { _id: string, [key: string]: any }};
    
  const bodyIngredients = body.ingredients.reduce((acc: Array<object>, { ingredient: { _id, ...rest } }: TBodyIngredient) => isObjectIdValid(_id) ? acc : [...acc, rest], []);
  const ingredients = await ingredientDao.createIngredients(bodyIngredients);
  
  let count = 0;
  return ({
    ...body,
    ingredients: body.ingredients.map((i: TBodyIngredient) => isObjectIdValid(i.ingredient._id)
      ? { ...i, _id: isObjectIdValid(i._id) ? i._id : undefined , ingredient: i.ingredient._id }
      : { ...i, _id: undefined, ingredient: ingredients[count++]._id }
    ),
    steps: body.steps.map(({ _id, ...rest }: { [key: string]: any }) => isObjectIdValid(_id) ? { _id, ...rest } : rest)
  });
}

export async function createRecipe(req: Request, res: Response, next: NextFunction) {
  try {
    const bodyRecipe = await elaborateRecipeBody(req.body);
    delete bodyRecipe._id;

    const recipe = await dao.createRecipe(bodyRecipe);
    res.status(OK).json(recipe);
  } catch (error) { handleError(error, next, 'recipes/createRecipe') }
}

export async function updateRecipe(req: Request, res: Response, next: NextFunction) {
  try {
    const bodyRecipe = await elaborateRecipeBody(req.body);

    const recipe = await dao.updateRecipe(req.params.id, bodyRecipe);
    res.status(OK).json(recipe);
  } catch (error) { handleError(error, next, 'recipes/updateRecipe') }
}

export async function deleteRecipe(req: Request, res: Response, next: NextFunction) {
  try {
    await calendarDao.deleteAllRecipeEvents(req.params.id);
    const result = await dao.deleteRecipe(req.params.id);
    res.status(OK).json(result);
  } catch (error) { handleError(error, next, 'recipes/deleteRecipe') }
}

export async function listRecipes(req: Request, res: Response, next: NextFunction) {
  try {
    const list = await dao.listRecipes(req.params.uid);
    res.status(OK).json(list);
  } catch (error) { handleError(error, next, 'recipes/listRecipes') }
}