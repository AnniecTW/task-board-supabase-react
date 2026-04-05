import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { Column } from "./Column";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/database";
import { useUpdateTaskStatus } from "../hooks/useUpdateTaskStatus";
import { createPortal } from "react-dom";
import { TaskCardPure } from "./TaskCardPure";
import { TaskDetailModal } from "./TaskDetailModal";
import { BoardSkeleton } from "./BoardSkeleton";

interface ColumnData {
  id: Task["status"];
  title: string;
  color: string;
}

const COLUMNS_CONF: ColumnData[] = [
  { id: "todo", title: "To Do", color: "bg-slate-500" },
  { id: "in_progress", title: "In Progress", color: "bg-blue-500" },
  { id: "in_review", title: "In Review", color: "bg-purple-500" },
  { id: "done", title: "Done", color: "bg-emerald-500" },
];

// ─── Modal state ────────────────────────────────────────────────────────────

interface ModalState {
  isOpen: boolean;
  task: Task | null;
  defaultStatus: string;
  defaultTitle: string;
}

const CLOSED_MODAL: ModalState = {
  isOpen: false,
  task: null,
  defaultStatus: "todo",
  defaultTitle: "",
};

// ─── Board ───────────────────────────────────────────────────────────────────

export const Board = () => {
  const { data: tasks = [], isLoading, error } = useTasks();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const { mutate: updateTaskStatus } = useUpdateTaskStatus();
  const [modal, setModal] = useState<ModalState>(CLOSED_MODAL);

  // Drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      updateTaskStatus({ taskId, status: newStatus as Task["status"] });
    }

    setActiveTaskId(null);
  };

  // Modal handlers
  const openEditModal = (task: Task) => {
    setModal({ isOpen: true, task, defaultStatus: task.status, defaultTitle: "" });
  };

  const openCreateModal = (status: string, initialTitle = "") => {
    setModal({ isOpen: true, task: null, defaultStatus: status, defaultTitle: initialTitle });
  };

  const closeModal = () => setModal(CLOSED_MODAL);

  const activeTask = activeTaskId
    ? tasks.find((t) => t.id === activeTaskId)
    : null;

  const columnsWithTasks = useMemo(() => {
    return COLUMNS_CONF.map((col) => ({
      ...col,
      tasks: tasks.filter((t) => t.status === col.id),
    }));
  }, [tasks]);

  if (isLoading) return <BoardSkeleton />;
  if (error)
    return <div className="p-10 text-red-500">Error loading tasks.</div>;

  return (
    <main className="flex-1 overflow-x-auto p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-6">
          {columnsWithTasks.map((column) => (
            <Column
              key={column.id}
              title={column.title}
              tasks={column.tasks}
              color={column.color}
              status={column.id}
              onTaskClick={openEditModal}
              onNewTask={(initialTitle) => openCreateModal(column.id, initialTitle)}
            />
          ))}
        </div>
        {createPortal(
          <DragOverlay dropAnimation={null}>
            {activeTask ? (
              <div className="scale-105 opacity-80 shadow-2xl cursor-grabbing">
                <TaskCardPure task={activeTask} isDragging={true} />
              </div>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>

      <TaskDetailModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        task={modal.task}
        defaultStatus={modal.defaultStatus}
        defaultTitle={modal.defaultTitle}
      />
    </main>
  );
};
