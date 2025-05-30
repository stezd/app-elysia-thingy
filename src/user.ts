import { Cookie } from "bun";
import { Elysia, t } from "elysia";
export const user = new Elysia({ prefix: "/user" })
	.state({
		user: {} as Record<string, string>,
		session: {} as Record<number, string>
	})
	.model({
		signIin: t.Object({
			username: t.String({ minLength: 1 }),
			password: t.String({ minLength: 8 })
		}),
		session: t.Cookie(
			{
				token: t.Number()
			},
			{
				secrets: "seia"
			}
		)
	})
	.put(
		"/sign-up",
		async ({ body: { username, password }, store, status }) => {
			if (store.user[username]) {
				return status(400, {
					success: false,
					message: "User already exists"
				});
			}
			store.user[username] = await Bun.password.hash(password);
		},
		{
			body: t.Object({
				username: t.String({ minLength: 1 }),
				password: t.String({ minLength: 8 })
			})
		}
	)
	.post(
		"/sign-in",
		async ({
			store: { user, session },
			status,
			body: { username, password },
			cookie: { token }
		}) => {
			if (
				!user[username] ||
				!(await Bun.password.verify(password, user[username]))
			)
				return status(400, {
					success: false,
					message: "Invalid username or password"
				});

			const key = crypto.getRandomValues(new Uint32Array(1))[0];
			session[key] = username;
			token.value = key;
		},
		{
			body: t.Object({
				username: t.String({ minLength: 1 }),
				password: t.String({ minLength: 8 })
			}),
			cookie: t.Cookie(
				{
					token: t.Number()
				},
				{
					secrets: "seia"
				}
			)
		}
	);
