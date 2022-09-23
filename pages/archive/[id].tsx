import { Idea, Watched } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import DraggableList from "@components/draggableList";
import useMutation from "@libs/client/useMutation";
interface WatchedWithIdeas extends Watched {
  ideas: Idea[];
}
interface WatchedData {
  ok: boolean;
  watched: WatchedWithIdeas;
}
interface IdeasState {
  [key: string]: string[];
}

const Board: NextPage = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { data } = useSWR<WatchedData>(id ? `/api/archive/${id}` : null);

  const [lists, setLists] = useState([]);

  const [connectIdeas, { data: connectResult }] =
    useMutation("/api/ideas/connect");

  // useEffect(() => {
  //   if (connectResult) {
  //     console.log(connectResult);
  //   }
  // }, [connectResult]);

  useEffect(() => {
    if (data?.watched.ideas) {
      console.log(Object.values(data.watched.ideas));

      console.log(data.watched.ideas.map((idea) => Object.values(idea)));

      console.log(data.watched.ideas.map((idea) => idea.id));

      const ids = data.watched.ideas.map((idea) => idea.content);
      let lists: any = [];
      ids.forEach((id) => lists.push([id]));
      console.log("lists", lists);
      setLists(lists);
      // setIdeas();
    }
  }, [data]);

  const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
    const parsedIdea = JSON.parse(draggableId);
    if (!destination) return;
    // setIdeas((prev: any) => {
    //   const ideasCopy = [...prev];
    //   ideasCopy.splice(source.index, 1);
    //   ideasCopy.splice(destination.index, 0, parsedIdea);
    //   return ideasCopy;
    // });
  };

  const onClickSave = () => {};

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-screen overflow-auto">
        <nav className="flex justify-between items-center">
          {data?.watched?.original_title && (
            <h1 className="p-3">{data.watched.original_title}</h1>
          )}
          <button
            onClick={onClickSave}
            className="bg-orange-500 hover:bg-orange-600 text-white border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none text-sm px-2 h-8"
          >
            Save
          </button>
        </nav>
        <main className="flex gap-2 mx-2">
          {lists.map((list) => (
            <DraggableList key={list} list={list} />
          ))}
        </main>
      </div>
    </DragDropContext>
  );
};

export default Board;
