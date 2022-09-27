import { Draggable } from "@hello-pangea/dnd";
import React from "react";

interface DraggableItemProps {
  idea: {
    id: string;
    content: string;
  };
  index: number;
}

function DraggableItem({ idea, index }: DraggableItemProps) {
  return (
    <Draggable draggableId={idea.id} index={index}>
      {(magic: any) => (
        <li
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
          className="bg-white p-2 rounded-lg hover:shadow-md"
        >
          {idea.content}
        </li>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableItem);
