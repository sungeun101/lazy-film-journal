import { NextApiRequest,NextApiResponse } from "next";
import client from "../../lib/client";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    await client.user.create({
        data:{
            email:'hi',
            name:'hello'
        }
    });
    res.json({
        created:true
    })
}