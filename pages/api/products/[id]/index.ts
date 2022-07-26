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
    session: { user },
  } = req;
  const product = await client.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        productId: product?.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );
  const relatedWord = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: relatedWord,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
  res.json({
    ok: true,
    product,
    isLiked,
    relatedProducts,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
