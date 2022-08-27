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
      body,
      session: { user },
    } = req;
    if (body.content) {
      // my idea
      const { content } = body;
      const idea = await client.idea.create({
        data: {
          content,
          commentId: "",
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
      res.json({
        ok: true,
        idea,
      });
    } else {
      // bookmark
      const { commentId, message } = body;
      const alreadyExists = await client.idea.findFirst({
        where: {
          commentId,
          userId: user?.id,
        },
        select: {
          id: true,
        },
      });
      if (alreadyExists) {
        const idea = await client.idea.delete({
          where: {
            id: alreadyExists.id,
          },
        });
        res.json({
          ok: true,
          idea,
        });
      } else {
        const idea = await client.idea.create({
          data: {
            bookmarked: true,
            commentId,
            content: message,
            user: {
              connect: {
                id: user?.id,
              },
            },
          },
        });
        res.json({
          ok: true,
          idea,
        });
      }
    }
  } else if (req.method === "GET") {
    const ideas = await client.idea.findMany({});
    res.json({
      ok: true,
      ideas,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
