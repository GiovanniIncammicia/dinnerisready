import { TRecipe } from "../components/Recipes/reducer";
import { create, update, remove, get } from "./Fetch";

export const createRecipe = (body: TRecipe) => create('recipes/', body);
export const updateRecipe = (body: TRecipe) => update(`recipes/${body._id}`, body);
export const deleteRecipe = (id: string) => remove(`recipes/${id}`);
export const listRecipes = (uid: string) => get(`recipes/${uid}`);

// TODO: aggiungere TEvent (la rimozione dell'id viene fatta nel server per le recipes e nel client per gli events. In questo modo gli events non hanno più _id e typescript dà errore. scegliere un approccio solo)
export const createEvent = (body: any) => create('calendar/', body);
export const createEvents = (body: any) => create('calendar/createEvents', body);
export const deleteEvent = (id: string) => remove(`calendar/${id}`);
export const listEvents = (user: string, start: string, end: string) => get(`calendar/${user}?start=${start}&end=${end}`);
