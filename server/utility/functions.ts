import { ObjectID } from 'mongodb';

export const isEmptyObj = (obj: object) => {
  for (let _ in obj) return false;
  return true;
}

export const isObj = (obj: object) => obj && obj.toString() === '[object Object]';

export const isObjectIdValid = (_id: string) => ObjectID.isValid(_id) && String(new ObjectID(_id)) === _id;