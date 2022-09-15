import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
  } = req;
  const watched = await client.watched.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      ideas: {
        select: {
          id: true,
          content: true,
        },
      },
      original_title: true,
    },
  });
  res.json({
    ok: true,
    watched,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
