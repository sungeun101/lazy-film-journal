import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import smtpTransport from "@libs/server/email";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, phone } = req.body;
  const userInput = email ? { email } : phone ? { phone: +phone } : null;
  if (!userInput) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...userInput,
          },
          create: {
            name: "Anonymous",
            ...userInput,
          },
        },
      },
    },
  });

  if (phone) {
    //     const message = await twilioClient.messages.create({
    //       messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICES_SID,
    //       to: process.env.MY_PHONE!,
    //       body: `Your login token is ${payload}`,
    //     });
    //     console.log(message);
  } else if (email) {
    // const mailOptions = {
    //   from: process.env.MAIL_ID,
    //   to: email,
    //   subject: "Next Market Authentication Email",
    //   html: `<div>Authentication Code : <strong>${payload}</strong></div>`,
    // };
    // const result = smtpTransport.sendMail(mailOptions, (error, responses) => {
    //   if (error) {
    //     console.log(error);
    //     return null;
    //   } else {
    //     console.log(responses);
    //     return null;
    //   }
    // });
    // smtpTransport.close();
    // console.log(result);
  }

  return res.json({
    ok: true,
  });
}

export default withHandler("POST", handler);
``;
