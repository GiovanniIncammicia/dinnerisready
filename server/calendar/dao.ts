// DAO (Data Access Object) is responsible for all the database related operations
// DAO is the link between the server and the database
import { Schema, Document, model } from 'mongoose';

interface IEvent extends Document {
	date: Date,
	slot: number,
	recipe: string,
	user: string,
};

const EventSchema = new Schema({
	date: { type: Date, required: true },
	slot: { type: Number, require: true },
	recipe: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
	user: { type: String, required: true },
});

const Event = model<IEvent>('Event', EventSchema);

export async function createEvent(event: IEvent) {
	const events = (await Event.find({ date: new Date(event.date) }).lean()).filter(e => e.slot === event.slot);
	if (events.length < 3)	return (new Event(event)).save();
	else return null;
}
export async function createEvents(events: IEvent[]) {
	// TODO: controllare se esistono già 3 ricette in ogni slot
	return await Event.insertMany(events);
}
export async function deleteEvent(id: string) {
	await Event.findByIdAndDelete(id);
	return { ok: true };
}
export async function deleteAllRecipeEvents(recipe: string) {
	const events = await Event.deleteMany({ recipe });
	return { ok: true };
}
export async function listEvents(user: string, start: string, end: string) {
	return Event.find({ user, date: { $gte: new Date(start), $lte: new Date(end) } }).populate('recipe').lean().exec();
}