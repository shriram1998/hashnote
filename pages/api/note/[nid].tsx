import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@utils/database";
import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { rateLimit } from "@utils/helper";


export default async (req:NextApiRequest, res:NextApiResponse)=> {
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
                const note = await db.collection("notes").findOne({
                    $and: [{ email: session.user.email },
                            {_id:ObjectId(nid)}
                        ]
                    }
                )
                return res.status(200).json(note);
            case 'PUT':
                let putData;
                if (Object.keys(req.body).length) {
                    putData={ ...req.body, lastModified: new Date() } ;
                }
                else {
                    return res.status(200).json({message:'Not modified'});
                }
                 const putResponse = await db.collection("notes").updateOne({
                    $and: [{ email: session.user.email },
                            {_id:ObjectId(nid)}
                            ]
                        },
                     { $set:putData  },
                );
                return res.status(200).json(putResponse);
            case 'PATCH':
                 const patchResponse = await db.collection("notes").updateOne({
                    $and: [{ email: session.user.email },
                            {_id:ObjectId(nid)}
                            ]
                        },
                     { $push: req.body, $set: {lastModified:new Date()}},
                );
                return res.status(200).json(patchResponse);
            case 'DELETE':
                 const deleteResponse = await db.collection("notes").deleteOne({
                    $and: [{ email: session.user.email },
                            {_id:ObjectId(nid)}
                            ]
                        }
                );
                return res.status(200).json(deleteResponse);
            default:
                res.setHeader('Allow', ['GET','POST', 'PUT', 'DELETE'])
                res.status(405).end(`Method ${method} Not Allowed`)
        }
  }else {
        res.status(401).end();
    }
}