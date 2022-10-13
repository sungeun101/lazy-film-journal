import { Draggable } from "@hello-pangea/dnd";
import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button as MuiButton,
} from "@mui/material";
import Input from "@components/input";
import Button from "@components/button";
import { useForm } from "react-hook-form";

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
  const [editOn, setEditOn] = useState(false);

  const {
    handleSubmit: handleSubmitEdit,
    reset,
    watch,
    control,
    register,
  } = useForm({
    defaultValues: { updatedIdea: idea.content },
  });

  const onClickModalYes = () => {
    setOpenModal(false);
    setLists((prev: any) => {
      if (prev.length === 1 && prev[0].length === 1) {
        return [[]];
      }
      const arrAfterUpdated = [...prev][listIndex].filter(
        (obj: { id: string; content: string }) => obj.id !== idea.id
      );
      const result = {
        ...prev,
        [listIndex.toString()]: arrAfterUpdated,
      };
      return Object.values(result).filter((list: any) => list.length !== 0);
    });
  };

  const onClickModalNo = () => {
    setOpenModal(false);
  };

  const onEditValid = () => {
    setLists((prev: any) => {
      [...prev][listIndex].map((obj: { id: string; content: string }) => {
        if (obj.id === idea.id) {
          obj.content = watch("updatedIdea");
        }
        return obj;
      });
      return Object.values({ ...prev });
    });
    setEditOn(false);
  };

  const onEditClose = () => {
    setEditOn(false);
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
          {editOn ? (
            <>
              <form onSubmit={handleSubmitEdit(onEditValid)}>
                <textarea
                  {...register("updatedIdea")}
                  required={true}
                  className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500  min-h-[130px]"
                  onBlur={onEditValid}
                />
              </form>
              <div className="flex gap-1 text-xs justify-end">
                <button
                  type="button"
                  onClick={onEditValid}
                  className="text-gray-400 py-1.5 px-2 hover:text-gray-800 bg-gray-100 rounded-lg flex gap-0.5 items-center"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Update</span>
                </button>
                <button
                  type="button"
                  onClick={onEditClose}
                  className="text-gray-400 py-1.5 px-2 hover:text-gray-800 bg-gray-100 rounded-lg flex gap-0.5 items-center"
                >
                  <svg
                    className="w-3 h-3"
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
                  <span>Cancel</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setEditOn(true)}
                className="text-gray-400 p-1.5 grid hover:text-gray-800 absolute top-1 right-9 bg-gray-100 rounded-lg group-hover:visible invisible"
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setOpenModal(true)}
                className="text-gray-400 p-1.5 grid hover:text-gray-800 absolute top-1 right-1 bg-gray-100 rounded-lg group-hover:visible invisible"
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
                  <MuiButton onClick={onClickModalNo}>No</MuiButton>
                  <MuiButton onClick={onClickModalYes} autoFocus>
                    Yes
                  </MuiButton>
                </DialogActions>
              </Dialog>
              {idea.content}
            </>
          )}
        </li>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableItem);
