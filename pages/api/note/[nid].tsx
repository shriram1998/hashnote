import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@utils/database";
import { getSession } from 'next-auth/react';
import { ObjectId } from 'mongodb';
import { rateLimit } from "@utils/helper";
interface ObjectIdLike {
    id: string | Buffer;
    __id?: string;
    toHexString(): string;
}
type MongoID = string | number | ObjectId | Buffer | ObjectIdLike;

export default async function NoteIndivApi(req:NextApiRequest, res:NextApiResponse) {
    const session = await getSession({ req });
    if (session) {
        try {
            await rateLimit(3, req.headers["x-real-ip"]);
        } catch (error) {
            return res.status(429).end();
        }
        const { method } = req;
        const { nid } = req.query;
        const { db } = await connectToDatabase();
        switch (method) {
            case 'GET':
                try {
                   const note = await db.collection("notes").findOne({
                    $and: [{ email: session.user.email },
                            {_id:new ObjectId(nid as MongoID)}
                            ]
                        }
                    )
                    return res.status(200).json(note); 
                }
                catch (err) {
                    return res.status(500).json(err);
                }
            case 'PUT':
                let putData;
                if (Object.keys(req.body).length) {
                    putData = { ...req.body, lastModified: new Date() };
                }
                else {
                    return res.status(200).json({ message: 'Not modified' });
                }
                try {
                    const putResponse = await db.collection("notes").updateOne({
                        $and: [{ email: session.user.email },
                        { _id: new ObjectId(nid as MongoID) }
                        ]
                    },
                        { $set: putData },
                    );
                    return res.status(200).json(putResponse);
                }
                catch (err) {
                    return res.status(500).json(err);
                }
            case 'PATCH':
                try {
                    const patchResponse = await db.collection("notes").updateOne({
                        $and: [{ email: session.user.email },
                        { _id: new ObjectId(nid as MongoID) }
                        ]
                    },
                        { $push: req.body, $set: { lastModified: new Date() } },
                    );
                    return res.status(200).json(patchResponse);
                }
                catch (err) {
                    return res.status(500).json(err);
                }
            case 'DELETE':
                try {
                    const deleteResponse = await db.collection("notes").deleteOne({
                        $and: [{ email: session.user.email },
                        { _id: new ObjectId(nid as MongoID) }
                        ]
                    }
                    );
                    return res.status(200).json(deleteResponse);
                }
                catch (err) {
                    return res.status(500).json(err);
                }
            default:
                res.setHeader('Allow', ['GET','POST', 'PUT', 'DELETE'])
                res.status(405).end(`Method ${method} Not Allowed`)
        }
  }else {
        res.status(401).end();
    }
}