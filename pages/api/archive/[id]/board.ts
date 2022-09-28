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
      body: { lists },
      query: { id },
      session: { user },
    } = req;
    const alreadyExists = await client.board.findFirst({
      where: { watchedId: Number(id), userId: user?.id },
      select: {
        id: true,
      },
    });
    if (alreadyExists) {
      const board = await client.board.delete({
        where: {
          id: alreadyExists.id,
        },
      });
      res.json({
        ok: true,
        board,
      });
    }
    const board = await client.board.create({
      data: {
        lists,
        user: {
          connect: {
            id: user?.id,
          },
        },
        watched: {
          connect: {
            id: Number(id),
          },
        },
      },
    });
    res.json({ ok: true, board });
  } else if (req.method === "GET") {
    const {
      query: { id },
      session: { user },
    } = req;
    const board = await client.board.findFirst({
      where: { watchedId: Number(id), userId: user?.id },
      select: {
        lists: true,
      },
    });
    res.json({
      ok: true,
      board,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
