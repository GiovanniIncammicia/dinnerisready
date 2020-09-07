// Controllers are responsible for reading and manipulating the request, calling the daos and create and send the response
// They are the gate between the clients and the server
import { Request, Response, NextFunction} from 'express';
import * as dao from './dao';
import { OK } from '../utility/httpStatusCodes';
import { handleError } from '../utility/errorHandler';

export async function createIngredients(req: Request, res: Response, next: NextFunction) {
  try {
    const ingredient = await dao.createIngredients(req.body);
    res.status(OK).json(ingredient);
  } catch (error) { handleError(error, next, 'ingredients/createIngredients') }
}
export async function deleteIngredient(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await dao.deleteIngredient(req.params.id);
    res.status(OK).json(result);
  } catch (error) { handleError(error, next, 'ingredients/deleteIngredient') }
}
export async function listIngredients(req: Request, res: Response, next: NextFunction) {
  try {
    const list = await dao.listIngredients();
    res.status(OK).json(list);
  } catch (error) { handleError(error, next, 'ingredients/listIngredients') }
}