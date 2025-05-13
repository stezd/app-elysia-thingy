import {Elysia} from "elysia";
import {swagger} from "@elysiajs/swagger"

const app = new Elysia()
    .use(swagger())
    .get('/', ({path}) => path)
    .get("/hello", 'Do you miss me nigga?')
    .listen(6969);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
