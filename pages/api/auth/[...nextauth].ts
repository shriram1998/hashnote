import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Adapters from 'next-auth/adapters';
import type { NextApiRequest, NextApiResponse } from "next";

export default async(req:NextApiRequest, res:NextApiResponse) => {
    NextAuth(req,res,{
        providers: [
            Providers.GitHub({
                clientId: process.env.GITHUB_CLIENT_ID,
                clientSecret:process.env.GITHUB_CLIENT_SECRET
            }),
            Providers.Google({
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            }),
        ],
        debug: process.env.NODE_ENV === "development",
        secret: process.env.AUTH_SECRET,
        jwt: {
            secret:process.env.JWT_SECRET,
        },
        session: {
            jwt: true,
            maxAge: 24 * 60 * 60*30
        },
        adapter: Adapters.TypeORM.Adapter(process.env.MONGODB_URI),
    });
}
export const config = {
  api: {
    externalResolver: true,
  },
}