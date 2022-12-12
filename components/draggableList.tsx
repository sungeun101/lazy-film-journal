import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import DraggableItem from "./draggableItem";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
interface DraggableListProps {
  list: { id: string; content: string }[];
  index: number;
  setLists: React.Dispatch<any>;
}

interface IForm {
  text: string;
}
export interface Iidea {
  id: string;
  content: string;
  mine?: boolean;
}

function DraggableList({
  list,
  index: listIndex,
  setLists,
}: DraggableListProps) {
  const [openModal, setOpenModal] = useState(false);

  const { register, handleSubmit, reset } = useForm<IForm>();

  const onValid = ({ text }: IForm) => {
    const newIdea = {
      id: Date.now().toString(),
      content: text,
      mine: true,
    };
    setLists((prev: any) => {
      const result = {
        ...prev,
        [listIndex]: [...prev[listIndex], newIdea],
      };
      return Object.values(result);
    });
    reset();
  };

  const onClickModalYes = () => {
    setOpenModal(false);
    setLists((prev: any) => {
      const lists = [...prev];
      lists.splice(listIndex, 1);
      return Object.values(lists);
    });
  };

  const onClickModalNo = () => {
    setOpenModal(false);
  };

  return (
    <section className="px-2 pb-4 bg-gray-100 min-w-[175px] max-w-[30rem]">
      <button
        type="button"
        onClick={() => setOpenModal(true)}
        className=" text-gray-400 p-2 w-full grid hover:text-gray-800"
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
            Would you like to delete this column?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickModalNo}>No</Button>
          <Button onClick={onClickModalYes} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Droppable droppableId={listIndex.toString()}>
        {(magic: any) => (
          <ul
            ref={magic.innerRef}
            {...magic.droppableProps}
            className="flex flex-col gap-3 pb-3"
          >
            {list &&
              list.map((idea: Iidea, index: any) => (
                <DraggableItem
                  key={idea.id}
                  idea={idea}
                  index={index}
                  setLists={setLists}
                  listIndex={listIndex}
                />
              ))}
            {magic.placeholder}
          </ul>
        )}
      </Droppable>
      <form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("text", { required: true })}
          type="text"
          placeholder={`Add your thoughts...`}
          className="appearance-none w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
        />
      </form>
    </section>
  );
}

export default React.memo(DraggableList);
