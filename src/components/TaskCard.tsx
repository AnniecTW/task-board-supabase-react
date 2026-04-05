import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { TaskCardPure } from "./TaskCardPure";
import type { Task } from "../types/database";

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing group flex flex-col gap-3 rounded-lg border border-white/5 bg-[#161616] p-3 shadow-sm transition-all hover:border-white/10 hover:bg-[#1c1c1c]"
    >
      <TaskCardPure task={task} />
    </div>
  );
};
