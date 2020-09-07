import { Request, Response, NextFunction } from 'express';
import { Schema, Document, model } from 'mongoose';
import { INTERNAL_SERVER_ERROR } from './httpStatusCodes';

interface ILog extends Document {
	status: number
  route: string
  user: string
  message: string
  detail: any
};

const LogSchema = new Schema({
  status: { type: Number },
  route: { type: String },
  user: { type: String },
  message: { type: String },
  detail: { type: Schema.Types.Mixed },
}, { timestamps: { createdAt: 'createdAt' } });

const Log = model<ILog>('Log', LogSchema);

export class CustomError extends Error {
  status: number;
  detail: string;
  route: string;
  user: string;
  constructor(message: string = 'Generic Error', status: number = INTERNAL_SERVER_ERROR, detail: any = '') {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.detail = detail;
    this.route = '';
    this.user = '';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error Middleware called in app.ts
export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  let { status, message } = err;
  Log.create(Object.assign({ message }, err));
  console.error("LOG: ", err);
  return res.status(status).json({ message });
};

// Function to be called inside a catch statement
export const handleError = (err: CustomError, next: NextFunction, route: string, user: string = '') => {
  if (!(err instanceof CustomError)) err = new CustomError(err);
  err.route = route;
  err.user = user;
  next(err);
}