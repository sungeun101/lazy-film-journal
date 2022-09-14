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
    where: { id: id?.toString() },
    select: {
      id: true,
      ideas: {
        select: {
          id: true,
          content: true,
        },
      },
      original_name: true,
      original_title: true,
    },
  });

  if (!watched)
    res.status(404).json({ ok: false, error: "Watched Item Not Found" });

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
