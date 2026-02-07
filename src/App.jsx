import { useMemo, useState } from "react";
import {
  Check,
  Circle,
  NotebookPen,
  Smile,
  ClipboardList,
  Plus,
  Trash2,
} from "lucide-react";

function cn(...x) {
  return x.filter(Boolean).join(" ");
}

export default function App() {
  const [tab, setTab] = useState("tasks");

  // Tasks
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");

  // Notes
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");

  // Mood
  const [moods, setMoods] = useState([]);
  const [moodText, setMoodText] = useState("");

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.done).length;

  const progress = useMemo(() => {
    if (totalTasks === 0) return 0;
    return Math.round((doneTasks / totalTasks) * 100);
  }, [totalTasks, doneTasks]);

  function addTask() {
    if (!taskText.trim()) return;
    setTasks([{ id: Date.now(), text: taskText.trim(), done: false }, ...tasks]);
    setTaskText("");
  }

  function toggleTask(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  function addNote() {
    if (!noteText.trim()) return;
    setNotes([{ id: Date.now(), text: noteText.trim() }, ...notes]);
    setNoteText("");
  }

  function deleteNote(id) {
    setNotes(notes.filter((n) => n.id !== id));
  }

  function addMood() {
    if (!moodText.trim()) return;
    setMoods([{ id: Date.now(), text: moodText.trim() }, ...moods]);
    setMoodText("");
  }

  function deleteMood(id) {
    setMoods(moods.filter((m) => m.id !== id));
  }

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-slate-950">
        <div className="absolute left-1/2 top-[-180px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/25 blur-[130px]" />
        <div className="absolute bottom-[-220px] right-[-220px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/15 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              PixelPulse
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              A minimal productivity dashboard (Tasks • Notes • Mood)
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard title="Tasks" value={totalTasks} />
            <StatCard title="Done" value={doneTasks} />
            <StatCard title="Progress" value={`${progress}%`} />
          </div>
        </div>

        {/* Main Layout */}
        <div className="mt-8 grid gap-6 md:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-black/20 backdrop-blur">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Dashboard
            </div>

            <div className="mt-3 space-y-2">
              <SideButton
                active={tab === "tasks"}
                onClick={() => setTab("tasks")}
                icon={<ClipboardList className="h-4 w-4" />}
                label="Tasks"
              />
              <SideButton
                active={tab === "notes"}
                onClick={() => setTab("notes")}
                icon={<NotebookPen className="h-4 w-4" />}
                label="Notes"
              />
              <SideButton
                active={tab === "mood"}
                onClick={() => setTab("mood")}
                icon={<Smile className="h-4 w-4" />}
                label="Mood"
              />
            </div>

            {/* Progress Bar */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Task completion</span>
                <span className="font-semibold text-white">{progress}%</span>
              </div>

              <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-indigo-400"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Small progress daily → big results.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 backdrop-blur">
            {tab === "tasks" && (
              <Section
                title="Tasks"
                subtitle="Track your daily goals in a clean UI."
              >
                <InputRow
                  value={taskText}
                  onChange={setTaskText}
                  placeholder="Add a new task..."
                  onAdd={addTask}
                />

                <div className="mt-5 space-y-2">
                  {tasks.length === 0 ? (
                    <Empty text="No tasks found. Add one ✨" />
                  ) : (
                    tasks.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3"
                      >
                        <button
                          onClick={() => toggleTask(t.id)}
                          className="flex items-center gap-3 text-left"
                        >
                          {t.done ? (
                            <Check className="h-5 w-5 text-emerald-300" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-400" />
                          )}

                          <span
                            className={cn(
                              "text-sm",
                              t.done
                                ? "text-slate-400 line-through"
                                : "text-white"
                            )}
                          >
                            {t.text}
                          </span>
                        </button>

                        <button
                          onClick={() => deleteTask(t.id)}
                          className="rounded-xl p-2 text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </Section>
            )}

            {tab === "notes" && (
              <Section title="Notes" subtitle="Save quick notes while studying.">
                <InputRow
                  value={noteText}
                  onChange={setNoteText}
                  placeholder="Write a note..."
                  onAdd={addNote}
                />

                <div className="mt-5 space-y-2">
                  {notes.length === 0 ? (
                    <Empty text="No notes yet. Add one 📝" />
                  ) : (
                    notes.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3"
                      >
                        <div className="text-sm text-white">{n.text}</div>

                        <button
                          onClick={() => deleteNote(n.id)}
                          className="rounded-xl p-2 text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </Section>
            )}

            {tab === "mood" && (
              <Section
                title="Mood"
                subtitle="Log your mood and reflect on your day."
              >
                <InputRow
                  value={moodText}
                  onChange={setMoodText}
                  placeholder="Example: Happy 😄"
                  onAdd={addMood}
                />

                <div className="mt-5 space-y-2">
                  {moods.length === 0 ? (
                    <Empty text="No mood logs yet. Add one 😊" />
                  ) : (
                    moods.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3"
                      >
                        <div className="text-sm text-white">{m.text}</div>

                        <button
                          onClick={() => deleteMood(m.id)}
                          className="rounded-xl p-2 text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI Components ---------------- */

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur">
      <div className="text-xs text-slate-400">{title}</div>
      <div className="mt-1 text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function SideButton({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition",
        active
          ? "border-indigo-400/40 bg-indigo-500/15 text-white"
          : "border-white/10 bg-slate-950/30 text-slate-200 hover:bg-white/10"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div>
      <div>
        <div className="text-2xl font-bold text-white">{title}</div>
        <div className="mt-1 text-sm text-slate-300">{subtitle}</div>
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}

function InputRow({ value, onChange, placeholder, onAdd }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-500/20"
      />

      <button
        onClick={onAdd}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
      >
        <Plus className="h-4 w-4" />
        Add
      </button>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/30 px-4 py-6 text-center text-sm text-slate-300">
      {text}
    </div>
  );
}
