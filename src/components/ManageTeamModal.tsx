import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Trash2, UserPlus } from "lucide-react";
import { useTeamMembers } from "../hooks/useTeamMembers";
import { useCreateTeamMember } from "../hooks/useCreateTeamMember";
import { useDeleteTeamMember } from "../hooks/useDeleteTeamMember";

// ─── Schema ──────────────────────────────────────────────────────────────────

const memberSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  color: z.string().min(1),
});

type MemberFormValues = z.infer<typeof memberSchema>;

// ─── Component ───────────────────────────────────────────────────────────────

interface ManageTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageTeamModal = ({ isOpen, onClose }: ManageTeamModalProps) => {
  const { data: members = [] } = useTeamMembers();
  const { mutate: createMember, isPending: isCreating } = useCreateTeamMember();
  const { mutate: deleteMember } = useDeleteTeamMember();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: { name: "", color: "#6366f1" },
  });

  const currentColor = watch("color");

  const onSubmit = (values: MemberFormValues) => {
    createMember(
      { name: values.name.trim(), color: values.color },
      { onSuccess: () => reset({ name: "", color: values.color }) },
    );
  };

  const handleDelete = (memberId: string, memberName: string) => {
    if (!window.confirm(`Remove "${memberName}" from the team?`)) return;
    deleteMember(memberId);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]">
          <div className="rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
              <Dialog.Title className="text-xs font-medium text-slate-400">
                Manage Team
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="rounded p-1 text-slate-600 transition-colors hover:bg-white/5 hover:text-slate-300">
                  <X size={15} />
                </button>
              </Dialog.Close>
            </div>

            <div className="px-5 py-5">
              {/* Member list */}
              <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Team Members ({members.length})
              </p>

              {members.length === 0 ? (
                <p className="mb-5 text-sm text-slate-600">No members yet.</p>
              ) : (
                <ul className="mb-5 flex flex-col gap-2">
                  {members.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2"
                    >
                      <div className="flex items-center gap-2.5">
                        {m.avatar_url ? (
                          <img
                            src={m.avatar_url}
                            alt={m.name}
                            className="h-6 w-6 rounded-full object-cover ring-1 ring-white/10"
                          />
                        ) : (
                          <div
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ring-1 ring-white/5"
                            style={{ backgroundColor: m.color ?? "#6366f1" }}
                          >
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm text-slate-300">{m.name}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(m.id, m.name)}
                        className="rounded p-1 text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Divider */}
              <div className="mb-5 h-px bg-white/5" />

              {/* Add member form */}
              <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Add Member
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <input
                      {...register("name")}
                      placeholder="Member name"
                      className="w-full rounded-lg border border-white/10 bg-[#252525] px-3 py-2 text-sm text-slate-300 outline-none transition-colors hover:border-white/20 placeholder:text-slate-600"
                    />
                    {errors.name && (
                      <p className="mt-1 text-[11px] text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Color picker */}
                  <label
                    className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-[#252525] transition-colors hover:border-white/20"
                    title="Pick avatar color"
                  >
                    <div
                      className="h-5 w-5 rounded-full ring-1 ring-white/10"
                      style={{ backgroundColor: currentColor }}
                    />
                    <input
                      type="color"
                      {...register("color")}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
                  >
                    <UserPlus size={14} />
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
