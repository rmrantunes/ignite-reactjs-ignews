import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { fauna } from "services/faunadb";
import { query as q } from "faunadb";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientSecret: process.env.GITHIUB_CLIENT_SECRET,
      clientId: process.env.GITHUB_CLIENT_ID,
      scope: "read:user",
    }),
  ],
  callbacks: {
    async signIn(user) {
      const { email } = user;

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(q.Match(q.Index("user_by_email"), q.Casefold(email)))
            ),
            q.Create(q.Collection("users"), { data: { email } }),
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email)))
          )
        );
        return true;
      } catch {
        return false;
      }
    },
  },
});
