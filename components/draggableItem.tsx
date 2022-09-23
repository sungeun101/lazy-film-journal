import { Draggable } from "@hello-pangea/dnd";
import React from "react";

interface DraggableItemProps {
  idea: string;
  index: number;
}

function DraggableItem({ idea, index }: DraggableItemProps) {
  return (
    <Draggable draggableId={idea} index={index}>
      {(magic: any) => (
        <li
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
          className="bg-white p-2 rounded-lg"
        >
          {idea}
        </li>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableItem);
