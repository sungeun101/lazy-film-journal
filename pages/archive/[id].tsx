import { Idea, Watched } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import DraggableItem from "@components/draggableItem";
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

  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    if (data?.watched.ideas) {
      setIdeas(data.watched.ideas);
    }
  }, [data?.watched.ideas]);

  const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
    const parsedIdea = JSON.parse(draggableId);
    if (!destination) return;
    setIdeas((prev: any) => {
      const ideasCopy = [...prev];
      ideasCopy.splice(source.index, 1);
      ideasCopy.splice(destination.index, 0, parsedIdea);
      return ideasCopy;
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        {data?.watched?.original_title && (
          <h1 className="p-3">Board for {data.watched.original_title}</h1>
        )}
        <main className="px-2 py-4 bg-gray-100">
          <Droppable droppableId="one">
            {(magic: any) => (
              <ul
                ref={magic.innerRef}
                {...magic.droppableProps}
                className="flex flex-col gap-3"
              >
                {ideas.map((idea: Idea, index: number) => (
                  <DraggableItem key={idea.id} idea={idea} index={index} />
                ))}
                {magic.placeholder}
              </ul>
            )}
          </Droppable>
        </main>
      </div>
    </DragDropContext>
  );
};

export default Board;
