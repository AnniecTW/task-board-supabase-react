import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, AlignLeft, Tag, Calendar, Layers, UserCircle2 } from "lucide-react";
import type { Task } from "../types/database";
import { useUpdateTask } from "../hooks/useUpdateTask";
import { useCreateTask } from "../hooks/useCreateTask";
import { useTeamMembers } from "../hooks/useTeamMembers";

// Schema

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "normal", "high"]),
  due_date: z.string().optional(),
  status: z.enum(["todo", "in_progress", "in_review", "done"]),
  assignee_id: z.string().nullable().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

// Constants

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "done", label: "Done" },
] as const;

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", color: "text-slate-400" },
  { value: "normal", label: "Normal", color: "text-blue-400" },
  { value: "high", label: "High", color: "text-orange-500" },
] as const;

// Sub-components

function FieldLabel({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
      <Icon size={11} />
      {children}
    </label>
  );
}

// Main Modal

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Pass an existing Task to edit, or null to create a new one */
  task: Task | null;
  /** Status pre-selected when creating a new task */
  defaultStatus?: string;
  /** Title pre-filled when opening from the inline quick-create form */
  defaultTitle?: string;
}

export const TaskDetailModal = ({
  isOpen,
  onClose,
  task,
  defaultStatus = "todo",
  defaultTitle = "",
}: TaskDetailModalProps) => {
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { data: members = [] } = useTeamMembers();

  const isNew = !task;
  const isPending = isUpdating || isCreating;

  const buildDefaults = (): TaskFormValues => ({
    title: task?.title ?? defaultTitle,
    description: task?.description ?? "",
    priority: (task?.priority as TaskFormValues["priority"]) ?? "low",
    due_date: task?.due_date ?? "",
    status:
      (task?.status as TaskFormValues["status"]) ??
      (defaultStatus as TaskFormValues["status"]),
    assignee_id: task?.assignee_id ?? "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: buildDefaults(),
  });

  // Sync form when the modal opens (different task or create mode)
  useEffect(() => {
    if (isOpen) reset(buildDefaults());
  }, [isOpen, task?.id, defaultTitle]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (values: TaskFormValues) => {
    const payload = {
      title: values.title,
      description: values.description || null,
      priority: values.priority,
      due_date: values.due_date || null,
      status: values.status,
      assignee_id: values.assignee_id || null,
    };

    if (isNew) {
      createTask({
        ...payload,
        created_at: new Date().toISOString(),
      });
    } else {
      updateTask({ taskId: task.id, updates: payload });
    }

    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Panel */}
        <Dialog.Content
          className="
            fixed left-1/2 top-1/2 z-50
            w-full max-w-lg -translate-x-1/2 -translate-y-1/2
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]
          "
        >
          <div className="rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl">
            {/* ── Header ── */}
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
              <Dialog.Title className="text-xs font-medium text-slate-400">
                {isNew ? "New Task" : "Edit Task"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="rounded p-1 text-slate-600 transition-colors hover:bg-white/5 hover:text-slate-300">
                  <X size={15} />
                </button>
              </Dialog.Close>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-5">
              {/* Title */}
              <div className="mb-5">
                <input
                  {...register("title")}
                  placeholder="Task title"
                  autoFocus
                  className="w-full bg-transparent text-[17px] font-medium text-slate-100 outline-none placeholder:text-slate-600"
                />
                {errors.title && (
                  <p className="mt-1 text-[11px] text-red-400">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <div className="mb-2">
                  <FieldLabel icon={AlignLeft}>Description</FieldLabel>
                </div>
                <textarea
                  {...register("description")}
                  placeholder="Add a description…"
                  rows={3}
                  className="w-full resize-none bg-transparent text-sm text-slate-400 outline-none placeholder:text-slate-600"
                />
              </div>

              {/* Divider */}
              <div className="mb-5 h-px bg-white/5" />

              {/* Status + Priority */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <FieldLabel icon={Layers}>Status</FieldLabel>
                  <select
                    {...register("status")}
                    className="appearance-none rounded-lg border border-white/10 bg-[#252525] px-3 py-2 text-sm text-slate-300 outline-none transition-colors hover:border-white/20"
                    style={{ colorScheme: "dark" }}
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel icon={Tag}>Priority</FieldLabel>
                  <select
                    {...register("priority")}
                    className="appearance-none rounded-lg border border-white/10 bg-[#252525] px-3 py-2 text-sm text-slate-300 outline-none transition-colors hover:border-white/20"
                    style={{ colorScheme: "dark" }}
                  >
                    {PRIORITY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date + Assignee */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <FieldLabel icon={Calendar}>Due Date</FieldLabel>
                  <input
                    type="date"
                    {...register("due_date")}
                    className="rounded-lg border border-white/10 bg-[#252525] px-3 py-2 text-sm text-slate-300 outline-none transition-colors hover:border-white/20"
                    style={{ colorScheme: "dark" }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel icon={UserCircle2}>Assignee</FieldLabel>
                  <select
                    {...register("assignee_id")}
                    className="appearance-none rounded-lg border border-white/10 bg-[#252525] px-3 py-2 text-sm text-slate-300 outline-none transition-colors hover:border-white/20"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isNew ? "Create Task" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
