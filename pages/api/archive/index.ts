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
        original_title,
        release_date,
        overview,
        isMovie,
      },
      session: { user },
    } = req;
    const alreadyExists = await client.watched.findFirst({
      where: {
        id: Number(id),
        userId: user?.id,
      },
      select: {
        id: true,
      },
    });
    if (alreadyExists) {
      const watched = await client.watched.delete({
        where: {
          id: alreadyExists.id,
        },
      });
      await client.idea.delete({
        where: {
          id: alreadyExists.id.toString(),
        },
      });
      await client.board.delete({
        where: {
          id: alreadyExists.id,
        },
      });
      res.json({
        ok: true,
        watched,
      });
    } else {
      const watched = await client.watched.create({
        data: {
          id: Number(id),
          poster_path,
          original_title,
          release_date,
          overview,
          isMovie: Boolean(isMovie),
          user: {
            connect: { id: user?.id },
          },
        },
      });
      res.json({ ok: true, watched });
    }
  }
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;
    const watched = await client.watched.findMany({
      where: {
        userId: user?.id,
      },
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
