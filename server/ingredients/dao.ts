// DAO (Data Access Object) is responsible for all the database related operations
// DAO is the link between the server and the database
import { Schema, Document, model } from 'mongoose';

enum Unit {	g, ml, l, cup, tbsp, tsp, qb };

interface IIngredient extends Document {
	names: string[],
	unit: Unit,
};

const IngredientSchema = new Schema({
	names: [{ type: String, required: true }],
	unit: { type: String, enum: ['', 'g', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'qb'] },
});

const Ingredient = model<IIngredient>('Ingredient', IngredientSchema);

export async function createIngredients(ingredients: IIngredient[]) {
	return await Ingredient.insertMany(ingredients);
}
export async function deleteIngredient(id: string) {
	await Ingredient.findByIdAndDelete(id);
	return { ok: true };
}
export async function listIngredients() {
	return Ingredient.find().lean().exec();
}