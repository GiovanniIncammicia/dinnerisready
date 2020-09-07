// Middlewares is responsible for all preliminary manipulations, as well as populating body with custom variables
import { Request, Response, NextFunction } from 'express';
import { isEmptyObj } from './functions';

export async function checkBody(req: Request, res: Response, next: NextFunction) {
  if (!isEmptyObj(req.body)) next();
  else return res.status(400).json({ error: 'Empty body' });
}