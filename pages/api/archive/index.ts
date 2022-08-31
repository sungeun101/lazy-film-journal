import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      body: {
        id,
        poster_path,
        original_name,
        original_title,
        first_air_date,
        release_date,
        overview,
      },
      session: { user },
    } = req;
    const watched = await client.watched.create({
      data: {
        id,
        poster_path,
        original_name,
        original_title,
        first_air_date,
        release_date,
        overview,
        user: {
          connect: { id: user?.id },
        },
      },
    });
    res.json({ ok: true, watched });
  }
  if (req.method === "GET") {
    const watched = await client.watched.findMany({
      include: {
        _count: {
          select: { ideas: true },
        },
      },
    });
    res.json({
      ok: true,
      watched,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
