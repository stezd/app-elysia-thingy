import { Elysia } from "elysia"
import { swagger } from "@elysiajs/swagger"
import { note } from "./note"

const app = new Elysia().use(swagger()).use(note).listen(6969)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
