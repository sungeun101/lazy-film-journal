import { Draggable } from "@hello-pangea/dnd";
import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";

interface DraggableItemProps {
  idea: {
    id: string;
    content: string;
  };
  index: number;
  setLists: React.Dispatch<any>;
  listIndex: number;
}

function DraggableItem({
  idea,
  index,
  setLists,
  listIndex,
}: DraggableItemProps) {
  const [openModal, setOpenModal] = useState(false);

  const onClickModalYes = () => {
    setOpenModal(false);
    setLists((prev: any) => {
      const arrAfterRemoved = [...prev][listIndex].filter(
        (obj: { id: string; content: string }) => obj.id !== idea.id
      );
      const result = {
        ...prev,
        [listIndex.toString()]: arrAfterRemoved,
      };

      return Object.values(result).filter((list: any) => list.length !== 0);
    });
  };

  const onClickModalNo = () => {
    setOpenModal(false);
  };

  return (
    <Draggable draggableId={idea.id} index={index}>
      {(magic: any) => (
        <li
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
          className="bg-white p-2 rounded-lg hover:shadow-md relative group"
        >
          <button
            type="button"
            onClick={() => setOpenModal(true)}
            className="text-gray-400 p-1.5 grid hover:text-gray-800 absolute top-1 right-1 bg-gray-100 rounded-lg invisible group-hover:visible"
          >
            <svg
              className="w-4 h-4 justify-self-end"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <Dialog
            open={openModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Would you like to delete this?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClickModalNo}>No</Button>
              <Button onClick={onClickModalYes} autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
          {idea.content}
        </li>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableItem);
