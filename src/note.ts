import { Elysia, t } from "elysia";

class Note {
	constructor(public data: string[] = ["Moonhalo"]) {}

	add(note: string) {
		this.data.push(note);
		return this.data;
	}

	remove(index: number) {
		return this.data.splice(index, 1);
	}

	update(index: number, note: string) {
		this.data[index] = note;
		return note;
	}
}

export const note = new Elysia({ prefix: "/note" })
	.decorate("note", new Note())
	.onTransform(({ body, params, path, request: { method } }) => {
		console.log(`${method} ${path}`, { body, params });
	})
	.get("/", ({ note }) => note.data)
	.put("/", ({ note, body: { data } }) => note.add(data), {
		body: t.Object({
			data: t.String({ minLength: 1 })
		})
	})
	.guard({
		params: t.Object({
			index: t.Number()
		})
	})
	.get("/:index", ({ note, params: { index }, status }) => {
		return note.data[index] ?? status(404, "oh no :(");
	})
	.delete("/:index", ({ note, params: { index }, status }) => {
		if (index in note.data) return note.remove(index);
		return status(422);
	})
	.patch(
		"/:index",
		({ note, params: { index }, body: { data }, status }) => {
			if (index in note.data) return note.update(index, data);
			return status(422);
		},
		{
			body: t.Object({
				data: t.String({ minLength: 1 })
			})
		}
	);
