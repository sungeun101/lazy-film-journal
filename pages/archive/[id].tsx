import { Idea, Watched } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

interface WatchedWithIdeas extends Watched {
  ideas: Idea[];
}
interface WatchedData {
  ok: boolean;
  watched: WatchedWithIdeas;
}

const Board: NextPage = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { data } = useSWR<WatchedData>(id ? `/api/archive/${id}` : null);
  console.log(data);

  return (
    <>
      {data?.watched?.original_title && (
        <h1>Board for {data.watched.original_title}</h1>
      )}
      {data?.watched?.ideas && (
        <ul>
          {data.watched.ideas.map((item: Idea) => (
            <li key={item.id}>{item.content}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Board;
