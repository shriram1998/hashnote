import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@utils/database";
import { getSession } from 'next-auth/react';
import { rateLimit } from "@utils/helper";

export default async (req:NextApiRequest, res:NextApiResponse)=> {
    const session = await getSession({ req });
    if (session) {
        try {
            await rateLimit(1, req.headers["x-real-ip"]);
        } catch (error) {
            return res.status(429).end();
        }
        const { method } = req;
        switch (method) {
            case 'GET':
                try {
                    const { db } = await connectToDatabase();
                    const note = await db.collection("notes").find({ email: session.user.email }).toArray();
                    return res.status(200).json(note);
                } catch (err) {
                    return res.status(500).json(err);
                }
            default:
                res.setHeader('Allow', ['GET'])
                res.status(405).end(`Method ${method} Not Allowed`)
        }
  }else {
        res.status(401).end();
    }
}