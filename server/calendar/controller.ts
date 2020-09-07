// Controllers are responsible for reading and manipulating the request, calling the daos and create and send the response
// They are the gate between the clients and the server
import { Request, Response, NextFunction} from 'express';
import * as dao from './dao';
import { OK, CONFLICT } from '../utility/httpStatusCodes';
import { handleError } from '../utility/errorHandler';

export async function createEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await dao.createEvent(req.body);
    if (event) res.status(OK).json(event);
    else res.status(CONFLICT).json({ message: 'You already have added three recipes to this slot, please delete one before retrying.' })
  } catch (error) { handleError(error, next, 'events/createEvent') }
}
export async function createEvents(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(OK).json(await dao.createEvents(req.body));
  } catch (error) { handleError(error, next, 'events/createEvents') }
}
export async function deleteEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await dao.deleteEvent(req.params.id);
    res.status(OK).json(result);
  } catch (error) { handleError(error, next, 'events/deleteEvent') }
}
export async function listEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const { start, end } = req.query;
    const list = await dao.listEvents(req.params.uid, start as string, end as string);
    res.status(OK).json(list);
  } catch (error) { handleError(error, next, 'events/listEvents') }
}