import { useMemo, useState } from 'react'
import {
  Plus,
  Search,
  Sparkles,
  CalendarDays,
  Smile,
  BookOpen,
  X,
  Heart,
  Trash2,
  Pencil,
  Lock,
  Unlock,
  Tag,
  Filter,
  Wand2,
  Save,
  Circle,
} from 'lucide-react'

const moodOptions = [
  { label: 'Happy', color: '#10B981', soft: '#D1FAE5' },
  { label: 'Calm', color: '#38BDF8', soft: '#E0F2FE' },
  { label: 'Neutral', color: '#7C3AED', soft: '#F3E8FF' },
  { label: 'Anxious', color: '#F59E0B', soft: '#FEF3C7' },
  { label: 'Sad', color: '#EF4444', soft: '#FEE2E2' },
]

const prompts = [
  'What has been on your mind today?',
  'What is one thing you handled well today?',
  'What emotion did you feel the most today?',
  'What is something you want to release?',
  'What is one small win you can be proud of?',
  'What would you tell a friend feeling like you today?',
]

const initialEntries = [
  {
    id: 1,
    date: 'Today',
    mood: 'Neutral',
    title: 'What has been on your mind today?',
    text: 'Trying to stay focused and build a healthier routine. I felt distracted, but I completed one small task.',
    tags: ['focus', 'routine'],
    private: true,
    favorite: false,
  },
  {
    id: 2,
    date: 'Yesterday',
    mood: 'Happy',
    title: 'What went well?',
    text: 'I went for a walk and felt calmer afterwards.',
    tags: ['walk', 'calm'],
    private: false,
    favorite: true,
  },
]

function getMoodMeta(mood) {
  return moodOptions.find((item) => item.label === mood) || moodOptions[2]
}

function todayLabel() {
  return 'Today'
}

export default function Journal() {
  const [entries, setEntries] = useState(initialEntries)
  const [search, setSearch] = useState('')
  const [moodFilter, setMoodFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    title: '',
    text: '',
    mood: 'Neutral',
    tags: '',
    private: true,
  })

  const filteredEntries = useMemo(() => {
    const q = search.trim().toLowerCase()

    return entries.filter((entry) => {
      const matchesSearch =
        !q ||
        `${entry.title} ${entry.text} ${entry.date} ${entry.mood} ${entry.tags.join(' ')}`
          .toLowerCase()
          .includes(q)

      const matchesMood = moodFilter === 'All' || entry.mood === moodFilter

      return matchesSearch && matchesMood
    })
  }, [entries, search, moodFilter])

  const moodSummary = useMemo(() => {
    return moodOptions.map((mood) => ({
      ...mood,
      count: entries.filter((entry) => entry.mood === mood.label).length,
    }))
  }, [entries])

  const topMood = useMemo(() => {
    const sorted = [...moodSummary].sort((a, b) => b.count - a.count)
    return sorted[0]
  }, [moodSummary])

  const insightText = useMemo(() => {
    if (entries.length === 0) {
      return 'Start your first entry to unlock personal insights.'
    }

    if (topMood?.label === 'Anxious') {
      return 'Your recent entries show signs of anxiety. Try a short breathing reset or write down one thing you can control today.'
    }

    if (topMood?.label === 'Sad') {
      return 'Your recent entries show lower mood. Consider reaching out to someone you trust or doing one small grounding activity.'
    }

    if (topMood?.label === 'Happy' || topMood?.label === 'Calm') {
      return 'Your recent entries show positive emotional balance. Keep repeating the habits that helped you feel this way.'
    }

    return 'Your recent entries show mixed emotions. Keep journaling daily to better understand your patterns.'
  }, [entries.length, topMood])

  const randomPrompt = () => {
    return prompts[Math.floor(Math.random() * prompts.length)]
  }

  const openNewModal = () => {
    setEditingId(null)
    setForm({
      title: randomPrompt(),
      text: '',
      mood: 'Neutral',
      tags: '',
      private: true,
    })
    setShowModal(true)
  }

  const useRandomPrompt = () => {
    setForm((prev) => ({
      ...prev,
      title: randomPrompt(),
    }))
  }

  const openEditModal = (entry) => {
    setEditingId(entry.id)
    setForm({
      title: entry.title,
      text: entry.text,
      mood: entry.mood,
      tags: entry.tags.join(', '),
      private: entry.private,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleSaveEntry = (e) => {
    e.preventDefault()

    if (!form.title.trim() || !form.text.trim()) {
      alert('Please add a title and journal text.')
      return
    }

    const payload = {
      title: form.title.trim(),
      text: form.text.trim(),
      mood: form.mood,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      private: form.private,
    }

    if (editingId) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingId
            ? {
                ...entry,
                ...payload,
              }
            : entry
        )
      )
    } else {
      setEntries((prev) => [
        {
          id: Date.now(),
          date: todayLabel(),
          favorite: false,
          ...payload,
        },
        ...prev,
      ])
    }

    closeModal()
  }

  const toggleFavorite = (id) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              favorite: !entry.favorite,
            }
          : entry
      )
    )
  }

  const togglePrivacy = (id) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              private: !entry.private,
            }
          : entry
      )
    )
  }

  const deleteEntry = (id) => {
    const confirmed = window.confirm('Delete this journal entry?')
    if (!confirmed) return

    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#111827]">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8 overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F3E8FF] px-3 py-1 text-xs font-bold text-[#6D28D9]">
                <Sparkles size={14} />
                Private reflection space
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-[#111827]">
                Journal
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B7280]">
                Write your thoughts, track your mood, save meaningful moments, and understand your emotional patterns over time.
              </p>
            </div>

            <button
              type="button"
              onClick={openNewModal}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#6D28D9] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-200/60 transition hover:scale-[1.02] hover:opacity-95"
            >
              <Plus size={16} />
              New Entry
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <SummaryCard
              title="Total Entries"
              value={entries.length}
              subtitle="Saved reflections"
              icon={<BookOpen size={18} />}
            />

            <SummaryCard
              title="Most Frequent Mood"
              value={topMood?.label || 'Neutral'}
              subtitle="Based on your journal"
              icon={<Smile size={18} />}
            />

            <SummaryCard
              title="Favorites"
              value={entries.filter((entry) => entry.favorite).length}
              subtitle="Important moments"
              icon={<Heart size={18} />}
            />
          </div>
        </div>

        <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_260px]">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by mood, tag, title, or text..."
              className="w-full rounded-2xl border border-[#E5E7EB] bg-white py-3 pl-11 pr-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#8B5CF6] focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <div className="relative">
            <Filter
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
            />

            <select
              value={moodFilter}
              onChange={(e) => setMoodFilter(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-[#E5E7EB] bg-white py-3 pl-11 pr-4 text-sm text-[#111827] outline-none transition focus:border-[#8B5CF6] focus:ring-4 focus:ring-purple-100"
            >
              <option value="All">All moods</option>
              {moodOptions.map((mood) => (
                <option key={mood.label} value={mood.label}>
                  {mood.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-[#E9D5FF] bg-[#F3E8FF] p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-3 text-[#6D28D9]">
              <Wand2 size={20} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#111827]">
                Smart Insight
              </h2>

              <p className="mt-1 text-sm leading-relaxed text-[#374151]">
                {insightText}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {moodSummary.map((mood) => (
            <button
              key={mood.label}
              type="button"
              onClick={() => setMoodFilter(mood.label)}
              className={`rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                moodFilter === mood.label ? 'ring-4 ring-purple-100' : ''
              }`}
              style={{
                background: mood.soft,
                borderColor: moodFilter === mood.label ? mood.color : 'transparent',
              }}
            >
              <Circle size={22} fill={mood.color} color={mood.color} />

              <p className="mt-2 text-sm font-bold" style={{ color: mood.color }}>
                {mood.label}
              </p>

              <p className="text-xs text-[#6B7280]">
                {mood.count} entr{mood.count === 1 ? 'y' : 'ies'}
              </p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <JournalCard
              key={entry.id}
              entry={entry}
              onEdit={openEditModal}
              onDelete={deleteEntry}
              onFavorite={toggleFavorite}
              onPrivacy={togglePrivacy}
            />
          ))}

          {filteredEntries.length === 0 && (
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-10 text-center shadow-sm">
              <BookOpen className="mx-auto text-[#6D28D9]" size={34} />

              <h3 className="mt-3 text-lg font-bold text-[#111827]">
                No journal entry found
              </h3>

              <p className="mt-1 text-sm text-[#6B7280]">
                Try another search or create a new journal entry.
              </p>

              <button
                type="button"
                onClick={openNewModal}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#6D28D9] px-5 py-3 text-sm font-bold text-white"
              >
                <Plus size={16} />
                Create Entry
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <NewEntryModal
          form={form}
          setForm={setForm}
          editing={Boolean(editingId)}
          onClose={closeModal}
          onSave={handleSaveEntry}
          onPrompt={useRandomPrompt}
        />
      )}
    </div>
  )
}

function SummaryCard({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F3E8FF] text-[#6D28D9]">
        {icon}
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">
        {title}
      </p>

      <p className="mt-1 text-xl font-bold text-[#111827]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#6B7280]">
        {subtitle}
      </p>
    </div>
  )
}

function JournalCard({ entry, onEdit, onDelete, onFavorite, onPrivacy }) {
  const mood = getMoodMeta(entry.mood)

  return (
    <article className="group rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: mood.soft, color: mood.color }}
          >
            <Circle size={22} fill={mood.color} color={mood.color} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={13} className="text-[#38BDF8]" />
                {entry.date}
              </span>

              <span>•</span>

              <span
                className="rounded-full px-2 py-1 text-xs font-bold"
                style={{
                  background: mood.soft,
                  color: mood.color,
                }}
              >
                {entry.mood}
              </span>

              <span className="inline-flex items-center gap-1">
                {entry.private ? <Lock size={12} /> : <Unlock size={12} />}
                {entry.private ? 'Private' : 'Shared'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          <IconButton
            title="Favorite"
            onClick={() => onFavorite(entry.id)}
            active={entry.favorite}
            icon={<Heart size={16} fill={entry.favorite ? '#EF4444' : 'none'} />}
          />

          <IconButton
            title="Privacy"
            onClick={() => onPrivacy(entry.id)}
            icon={entry.private ? <Lock size={16} /> : <Unlock size={16} />}
          />

          <IconButton
            title="Edit"
            onClick={() => onEdit(entry)}
            icon={<Pencil size={16} />}
          />

          <IconButton
            title="Delete"
            onClick={() => onDelete(entry.id)}
            danger
            icon={<Trash2 size={16} />}
          />
        </div>
      </div>

      <h2 className="text-lg font-bold text-[#111827]">
        {entry.title}
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-[#374151]">
        {entry.text}
      </p>

      {entry.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-[#F3E8FF] px-3 py-1 text-xs font-bold text-[#6D28D9]"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

function IconButton({ icon, onClick, title, active = false, danger = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
        danger
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : active
            ? 'bg-red-50 text-red-500'
            : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#EDE9FE] hover:text-[#6D28D9]'
      }`}
    >
      {icon}
    </button>
  )
}

function NewEntryModal({ form, setForm, editing, onClose, onSave, onPrompt }) {
  const activeMood = getMoodMeta(form.mood)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#F3E8FF] px-3 py-1 text-xs font-bold text-[#6D28D9]">
              <Sparkles size={13} />
              Guided journal
            </div>

            <h2 className="text-2xl font-bold text-[#111827]">
              {editing ? 'Edit Journal Entry' : 'New Journal Entry'}
            </h2>

            <p className="mt-1 text-sm text-[#6B7280]">
              Capture your thoughts clearly and privately.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280] transition hover:bg-[#E5E7EB]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-5">
          <div>
            <label className="mb-3 block text-sm font-bold text-[#111827]">
              How are you feeling?
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {moodOptions.map((mood) => (
                <button
                  key={mood.label}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      mood: mood.label,
                    }))
                  }
                  className={`rounded-3xl border p-3 text-center transition hover:-translate-y-0.5 ${
                    form.mood === mood.label ? 'ring-4 ring-purple-100' : ''
                  }`}
                  style={{
                    background: mood.soft,
                    borderColor: form.mood === mood.label ? mood.color : 'transparent',
                  }}
                >
                  <div className="flex justify-center">
                    <Circle size={22} fill={mood.color} color={mood.color} />
                  </div>

                  <p className="mt-2 text-xs font-bold" style={{ color: mood.color }}>
                    {mood.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <label className="block text-sm font-bold text-[#111827]">
                Prompt / Title
              </label>

              <button
                type="button"
                onClick={onPrompt}
                className="inline-flex items-center gap-1 rounded-full bg-[#F3E8FF] px-3 py-1.5 text-xs font-bold text-[#6D28D9]"
              >
                <Wand2 size={13} />
                New prompt
              </button>
            </div>

            <input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Example: What has been on your mind today?"
              className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#8B5CF6] focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-bold text-[#111827]">
                Journal
              </label>

              <span className="text-xs text-[#6B7280]">
                {form.text.length} characters
              </span>
            </div>

            <textarea
              value={form.text}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  text: e.target.value,
                }))
              }
              rows={7}
              placeholder="Write your thoughts here..."
              className="w-full resize-none rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm leading-relaxed outline-none placeholder:text-[#9CA3AF] focus:border-[#8B5CF6] focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#111827]">
              Tags
            </label>

            <input
              value={form.tags}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  tags: e.target.value,
                }))
              }
              placeholder="Example: sleep, focus, stress"
              className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#8B5CF6] focus:ring-4 focus:ring-purple-100"
            />

            <p className="mt-1 text-xs text-[#6B7280]">
              Separate tags with commas.
            </p>
          </div>

          <div
            className="flex items-center justify-between rounded-3xl border p-4"
            style={{
              background: activeMood.soft,
              borderColor: activeMood.color,
            }}
          >
            <div>
              <p className="text-sm font-bold text-[#111827]">
                Privacy
              </p>

              <p className="text-xs text-[#6B7280]">
                Keep this entry private or mark it as shared.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  private: !prev.private,
                }))
              }
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#111827] shadow-sm"
            >
              {form.private ? <Lock size={15} /> : <Unlock size={15} />}
              {form.private ? 'Private' : 'Shared'}
            </button>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-[#F3F4F6] px-5 py-3 text-sm font-bold text-[#374151] transition hover:bg-[#E5E7EB]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#6D28D9] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-200/60 transition hover:opacity-90"
            >
              <Save size={16} />
              {editing ? 'Save Changes' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}