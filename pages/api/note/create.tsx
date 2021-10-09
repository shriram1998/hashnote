import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@utils/database";
import { getSession } from 'next-auth/react';
import { rateLimit } from "@utils/helper";

const value = JSON.stringify([
    {
        type: 'paragraph',
        children: [
            { text: '' },
        ]
    },
]);
const seed = {
    value,
    "tags":[],
    "lastModified":new Date(),
    "favourite": false,
    "__v":0
}
export default async (req:NextApiRequest, res:NextApiResponse)=> {
    const session = await getSession({ req });
    if (session) {
        try {
            await rateLimit(1, req.headers["x-real-ip"]);
        } catch (error) {
            return res.status(429).end();
        }
        const { method } = req;
        const { db } = await connectToDatabase();
        if (method === 'POST') {
            try {
                switch (req.body.type) {
                    case 'text':
                        const textResult = await db.collection("notes").insertOne({ ...seed, type: 'text', email: session.user.email });
                        return res.status(200).json(textResult);
                    case 'code':
                        const codeResult = await db.collection("notes").insertOne({ ...seed, type: 'code', language: 'py', email: session.user.email });
                        return res.status(200).json(codeResult);
                    default:
                        console.log('Creating of type not allowed ', req.body.type);
                }
            }
            catch (err) {
                    return res.status(500).json(err);
                }
        } else {
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
        }
    } else {
        res.status(401).end();
    }
}