import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Idea } from "@prisma/client";
import DraggableItem from "./draggableItem";

interface DraggableListProps {
  list: { id: string; content: string }[];
  index: number;
}

function DraggableList({ list, index }: DraggableListProps) {
  return (
    <section className="px-2 py-4 bg-gray-100">
      <Droppable droppableId={index.toString()}>
        {(magic: any) => (
          <ul
            ref={magic.innerRef}
            {...magic.droppableProps}
            className="flex flex-col gap-3 pb-3"
          >
            {list &&
              list.map((idea: { id: string; content: string }, index: any) => (
                <DraggableItem key={idea.id} idea={idea} index={index} />
              ))}
            {magic.placeholder}
          </ul>
        )}
      </Droppable>
    </section>
  );
}

export default React.memo(DraggableList);
