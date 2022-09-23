import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Idea } from "@prisma/client";
import DraggableItem from "./draggableItem";

interface DraggableListProps {
  list: string[];
}

function DraggableList({ list }: DraggableListProps) {
  return (
    <section className="px-2 py-4 bg-gray-100">
      <Droppable droppableId={list[0]}>
        {(magic: any) => (
          <ul
            ref={magic.innerRef}
            {...magic.droppableProps}
            className="flex flex-col gap-3"
          >
            {list.map((idea: any, index: any) => (
              <DraggableItem key={idea} idea={idea} index={index} />
            ))}
            {magic.placeholder}
          </ul>
        )}
      </Droppable>
    </section>
  );
}

export default React.memo(DraggableList);
