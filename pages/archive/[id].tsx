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

  const [lists, setLists] = useState<any>([]);

  const [connectIdeas, { data: connectResult }] =
    useMutation("/api/ideas/connect");

  // useEffect(() => {
  //   if (connectResult) {
  //     console.log(connectResult);
  //   }
  // }, [connectResult]);

  useEffect(() => {
    if (data?.watched.ideas) {
      setLists([
        [
          {
            id: "UgwM_GdjpP_wDCu3XjN4AaABAg",
            content:
              '"The kids are gonna have a great time."\n\nLittle did he know that 80% of the audience would be teenagers dressed formally',
          },
          {
            id: "sample id",
            content: "sample content",
          },
        ],
        [
          {
            id: "Ugzff9IYC33X57Lrgf54AaABAg",
            content:
              "Minions: Rise of Gru is truly one of the movies ever. The script is written, the plot is there, and the characters are acted. I even shed a tear when Gru said \"I'm gonna gruin this man's whole career.\" One of my movies of all time",
          },
        ],
        [
          {
            id: "UgztSGF-9Dep5BdgSzV4AaABAg",
            content: "who is your favorite minion",
          },
        ],
      ]);
    }
  }, [data]);

  useEffect(() => {
    console.log("lists", lists);
    console.log(
      "Object.values(lists)",
      Object.values(lists).filter((list: any) => list.length !== 0)
    );
  }, [lists]);

  const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // same board movement
      setLists((prev: any) => {
        const sourceList = [...prev[source.droppableId]];
        const [removed] = sourceList.splice(source.index, 1);
        sourceList.splice(destination.index, 0, removed);
        return {
          ...prev,
          [source.droppableId]: sourceList,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // cross board movement
      setLists((prev: any) => {
        const sourceList = [...prev[source.droppableId]];
        const destinationList = [...prev[destination.droppableId]];
        const [removed] = sourceList.splice(source.index, 1);
        destinationList.splice(destination.index, 0, removed);
        return {
          ...prev,
          [source.droppableId]: sourceList,
          [destination.droppableId]: destinationList,
        };
      });
    }
  };

  const onClickSave = () => {};

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-screen overflow-auto">
        <nav className="flex justify-between items-center">
          {data?.watched?.original_title && (
            <h1 className="p-3 cursor-pointer">
              {data.watched.original_title}
            </h1>
          )}
          <button
            onClick={onClickSave}
            className="bg-orange-500 hover:bg-orange-600 text-white border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none text-sm px-2 h-8"
          >
            Save
          </button>
        </nav>
        <main className="flex gap-2 mx-2">
          {Object.values(lists)
            .filter((list: any) => list.length !== 0)
            .map((list: any, index: number) => (
              <DraggableList key={index} list={list} index={index} />
            ))}
        </main>
      </div>
    </DragDropContext>
  );
};

export default Board;
