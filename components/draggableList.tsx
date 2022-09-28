import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import DraggableItem from "./draggableItem";
import { useForm } from "react-hook-form";

interface DraggableListProps {
  list: { id: string; content: string }[];
  index: number;
  setLists: React.Dispatch<any>;
}

interface IForm {
  text: string;
}

function DraggableList({ list, index, setLists }: DraggableListProps) {
  const { register, handleSubmit, reset } = useForm<IForm>();

  const onValid = ({ text }: IForm) => {
    const newIdea = {
      id: Date.now().toString(),
      content: text,
    };
    setLists((prev: any) => {
      const result = {
        ...prev,
        [index]: [...prev[index], newIdea],
      };
      return Object.values(result);
    });
    reset();
  };

  return (
    <section className="px-2 py-4 bg-gray-100 min-w-[175px]">
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
