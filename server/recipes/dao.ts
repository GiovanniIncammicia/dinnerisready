// DAO (Data Access Object) is responsible for all the database related operations
// DAO is the link between the server and the database
import { Schema, Document, model } from 'mongoose';
import { CustomError } from '../utility/errorHandler';
import { NOT_FOUND } from '../utility/httpStatusCodes';

enum Workstation { chop, prep, cook };
enum Meal {	breakfast, snack, main };
type TStep = { workstation: Workstation, text: string, slot: number };
type TIngredient = { ingredient: string, qty: string };

export interface IRecipe extends Document {
	user: string,
	name: string,
	time: number,
	picture?: string,
	ingredients: TIngredient[],
	steps: TStep[],
	serves?: number,
	meal?: Meal,
	flags: number,
	last?: number,
};

const Step = {
	workstation: { type: String, enum: ['chop', 'prep', 'cook'], required: true },
	text: { type: String, required: true },
	slot: { type: Number, required: true },
};

const Ingredient = {
	ingredient: { type: Schema.Types.ObjectId, ref: 'Ingredient', required: true },
	qty: { type: String, default: 'qb' }
};

const RecipeSchema = new Schema({
	user: { type: String, required: true },
	name: { type: String, required: true },
	time: { type: Number, required: true },
	picture: String,
	ingredients: [Ingredient],
	steps: [Step],
	serves: Number,
	meal: { type: String, enum: ['breakfast', 'snack', 'main'] },
	flags: { type: Number, default: 0 },
	last: Number,
});

const Recipe = model<IRecipe>('Recipe', RecipeSchema);

export async function createRecipe(recipe: IRecipe) {
	const newRecipe = new Recipe(recipe);
	return (await newRecipe.save()).populate('ingredients.ingredient').execPopulate();
}
export async function updateRecipe(_id: string, recipe: IRecipe) {
	let newRecipe = await Recipe.findById(_id);
	if (!newRecipe) throw new CustomError('Recipe not found', NOT_FOUND);
	Object.assign(newRecipe, recipe);
	return (await newRecipe.save()).populate('ingredients.ingredient').execPopulate();
}
export async function deleteRecipe(id: string) {
	await Recipe.findByIdAndDelete(id);
	return { ok: true };
}
export async function listRecipes(user: string) {
	return Recipe.find({ user }).populate('ingredients.ingredient').lean().exec();
}