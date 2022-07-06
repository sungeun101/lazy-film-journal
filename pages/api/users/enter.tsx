import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler from "@libs/server/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, phone } = req.body;
  const userInput = email ? { email } : { phone: +phone };
const payload = Math.floor(100000+Math.random()*900000)+'';
  const token=await client.token.create({
    data:{
        payload,
        user:{
            connectOrCreate:{
                where:{
                    ...userInput 
                },
                create:{
                    name:"Anonymous",
                    ...userInput 
                }
            }
        }
    }
  })
  console.log(token);
  return res.status(200).end();
}

export default withHandler("POST", handler);
