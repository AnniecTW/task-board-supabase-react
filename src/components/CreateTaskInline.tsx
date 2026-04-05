import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useCreateTask } from "../hooks/useCreateTask";

interface CreateTaskInlineProps {
  status: string;
}

export const CreateTaskInline = ({ status }: CreateTaskInlineProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const { mutate: createTask } = useCreateTask();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自動聚焦輸入框
  useEffect(() => {
    if (isAdding) textareaRef.current?.focus();
  }, [isAdding]);

  const handleSave = () => {
    if (!title.trim()) {
      setIsAdding(false);
      return;
    }

    createTask({
      title: title.trim(),
      status: status,
      priority: "low",
      assignee_id: null,
      created_at: new Date().toISOString(),
    });

    setTitle("");
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
      >
        <Plus size={16} />
        <span>New Task</span>
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#1c1c1c] p-2 shadow-xl">
      <textarea
        ref={textareaRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSave();
          }
          if (e.key === "Escape") setIsAdding(false);
        }}
        placeholder="What needs to be done?"
        className="w-full resize-none bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
        rows={3}
      />
      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          onClick={() => setIsAdding(false)}
          className="rounded p-1 text-slate-500 hover:bg-white/5 hover:text-slate-300"
        >
          <X size={16} />
        </button>
        <button
          onClick={handleSave}
          className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};
