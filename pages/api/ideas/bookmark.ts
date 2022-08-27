import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;
  const data = await client.idea.findMany({
    where: {
      userId: user?.id,
      bookmarked: true,
    },
    select: {
      commentId: true,
      content: true,
    },
  });
  res.json({
    ok: true,
    data,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
