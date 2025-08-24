import { Lucia, TimeSpan } from "lucia";
import { AstroDBAdapter } from "lucia-adapter-astrodb";
import { db, Session, Users } from "astro:db";

const adapter = new AstroDBAdapter(db, Session, Users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: import.meta.env.PROD
		}
	},
	sessionExpiresIn: new TimeSpan(1, "h"),
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
	}
}
