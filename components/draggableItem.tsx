import { Draggable } from "@hello-pangea/dnd";
import { Idea } from "@prisma/client";
import React from "react";

interface DraggableItemProps {
  idea: Idea;
  index: number;
}

function DraggableItem({ idea, index }: DraggableItemProps) {
  console.log(idea.content, "has been rendered");
  return (
    <Draggable
      draggableId={JSON.stringify(idea)}
      index={index}
      key={JSON.stringify(idea)}
    >
      {(magic: any) => (
        <li
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
          className="bg-white p-2 rounded-lg"
        >
          {idea.content}
        </li>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableItem);
