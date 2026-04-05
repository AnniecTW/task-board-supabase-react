## Modern Kanban Board

A Kanban board inspired by Linear, built with an emphasis on speed, clarity, and a smooth user experience. The goal was to move beyond a simple task list and create something that feels responsive and practical for everyday use.

---

## Features

**Drag-and-Drop Workflow**

- Move tasks across columns with a smooth drag-and-drop experience powered by `@dnd-kit`

**Team Collaboration**

- Create and manage team members
- Assign one or more members to tasks

**Due Date Handling**

- Clear visual indicators for upcoming and overdue tasks
- Dates are handled in the user's local timezone

**Optimistic UI**

- Immediate feedback for actions like moving, editing, and deleting tasks
- Changes sync in the background without blocking the UI

**Task Details**

- Edit descriptions, priorities (Low / Normal / High), and status
- Designed to support more detailed task management without clutter

**Search**

- Real-time filtering by task title

**UX Details**

- Skeleton screens to prevent layout shifts during loading
- Empty states to guide users when there’s no data
- Toast notifications for success and error feedback

---

## Tech Stack

**Frontend**

- React 18
- TypeScript
- Tailwind CSS

**State & Data**

- React Query (TanStack)
- React Hook Form
- Zod

**Backend**

- Supabase (Auth, PostgreSQL, RLS)

**UI Components**

- Radix UI (Primitives)
- Lucide React (Icons)

**Feedback**

- React Hot Toast

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AnniecTW/task-board-supabase-react.git
cd task-board-supabase-react
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can either:

- Create your own Supabase project, or
- Use the demo credentials below

#### Demo Credentials

Public demo credentials with limited access:

```bash
VITE_SUPABASE_URL="https://bddhpygyuoalihcukyia.supabase.co"
VITE_SUPABASE_ANON_KEY="sb_publishable_rXg9FgYPjBNWVo2C8wCAdA_do3yjP4g"
```

Note: This demo project uses Row Level Security and is intended for testing only.

### 4. Run the development server

```bash
npm run dev
```

## Security & Architecture

**Authentication**

- Uses anonymous auth to create a guest session on first launch
- Allows users to start using the app without a sign-up flow

**Data Protection**

- Supabase Row Level Security (RLS) ensures users can only access their own data

**Architecture**

- Modular component structure
- Custom hooks separate data fetching from UI logic
