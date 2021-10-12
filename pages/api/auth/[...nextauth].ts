import NextAuth from 'next-auth';
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { connectToDatabase } from "@utils/database";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function NextAuthApi(req: NextApiRequest, res: NextApiResponse)  {
    const { db } = await connectToDatabase();
    NextAuth(req,res,{
        providers: [
            GithubProvider({
                clientId: process.env.GITHUB_CLIENT_ID,
                clientSecret:process.env.GITHUB_CLIENT_SECRET
            }),
            GoogleProvider({
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
        adapter: MongoDBAdapter({ db}),
    });
}
export const config = {
  api: {
    externalResolver: true,
  },
}