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

const Board: NextPage = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { data: boardData } = useSWR(id ? `/api/archive/${id}/board` : null);
  const { data: watchedData } = useSWR<WatchedData>(
    id ? `/api/archive/${id}` : null
  );

  const [lists, setLists] = useState<any>([]);

  const [postBoard, { data: postResult }] = useMutation(
    `/api/archive/${id}/board`
  );

  useEffect(() => {
    if (postResult) {
      console.log(postResult);
    }
  }, [postResult]);

  useEffect(() => {
    if (boardData && watchedData) {
      if (boardData.board?.lists) {
        setLists(boardData.board.lists);
      } else {
        setLists([watchedData.watched.ideas]);
      }
    }
  }, [boardData, watchedData]);

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;
    if (destination.droppableId === source.droppableId) {
      // same board movement
      setLists((prev: any) => {
        const sourceList = [...prev[source.droppableId]];
        sourceList;
        const [removed] = sourceList.splice(source.index, 1);
        sourceList.splice(destination.index, 0, removed);
        const result = {
          ...prev,
          [source.droppableId]: sourceList,
        };
        return Object.values(result).filter((list: any) => list.length !== 0);
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // cross board movement
      setLists((prev: any) => {
        const sourceList = [...prev[source.droppableId]];
        const destinationList = [...prev[destination.droppableId]];
        const [removed] = sourceList.splice(source.index, 1);
        destinationList.splice(destination?.index, 0, removed);
        const result = {
          ...prev,
          [source.droppableId]: sourceList,
          [destination.droppableId]: destinationList,
        };
        return Object.values(result).filter((list: any) => list.length !== 0);
      });
    }
  };

  const onClickSave = () => {
    postBoard({ lists });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-screen overflow-auto">
        <nav className="flex justify-between items-center">
          {watchedData?.watched?.original_title && (
            <h1 className="p-3 cursor-pointer">
              {watchedData.watched.original_title}
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
          {lists.map((list: any, index: number) => (
            <DraggableList
              key={index}
              list={list}
              index={index}
              setLists={setLists}
            />
          ))}
        </main>
      </div>
    </DragDropContext>
  );
};

export default Board;
