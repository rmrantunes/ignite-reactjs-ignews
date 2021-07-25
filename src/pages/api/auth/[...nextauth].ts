import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientSecret: process.env.GITHIUB_CLIENT_SECRET,
      clientId: process.env.GITHUB_CLIENT_ID,
      scope: "read:user",
    }),
  ],
});
