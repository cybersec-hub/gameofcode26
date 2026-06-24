import { useState } from 'react'
import {
  EyeOff,
  Heart,
  MessageCircle,
  Plus,
  Phone,
  MapPin,
  ChevronRight,
  Bookmark,
  Smile,
  Send,
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { SUPPORT_SERVICES } from '../lib/services'
import { Chip } from '../components/ui'

const SEED_POSTS = [
  {
    id: 1,
    region: 'Port Louis',
    when: '2 hours ago',
    tag: 'ANXIETY',
    tagColor: '#0090a9',
    body:
      "Feeling overwhelmed with exams lately. It feels like I can't catch my breath some mornings. Has anyone found a good way to stay calm during finals week?",
    hearts: 24,
    supports: 18,
    comments: [
      {
        id: 101,
        when: '1 hour ago',
        body: 'Try breathing slowly for 2 minutes before starting revision. It helps me calm down.',
      },
      {
        id: 102,
        when: '45 minutes ago',
        body: 'You are not alone. Finals week is hard, but take it one step at a time.',
      },
    ],
  },
  {
    id: 2,
    region: 'Curepipe',
    when: '5 hours ago',
    tag: 'HEALING',
    tagColor: '#712ae2',
    body:
      "Just wanted to share that I finally reached out to one of the NGOs listed here. It was scary to make the call, but they were so kind. If you're hesitant, this is your sign to try.",
    hearts: 56,
    supports: 12,
    comments: [],
  },
]

const MAP_SERVICES = [
  {
    name: 'Befrienders Mauritius',
    region: 'Rose Hill',
    phone: '802 22 22',
    services: 'Counselling, Suicide Prevention',
    position: [-20.2402, 57.4707],
  },
  {
    name: 'TIPA Art Therapy',
    region: 'Quatre Bornes',
    phone: '467 66 12',
    services: 'Youth Support, Creative Healing',
    position: [-20.2655, 57.4791],
  },
  {
    name: 'Action Familiale',
    region: 'Port Louis',
    phone: '211 41 41',
    services: 'Family Support, Youth Counselling',
    position: [-20.1609, 57.5012],
  },
]

const mauritiusCenter = [-20.235, 57.55]

const customMarker = new L.DivIcon({
  className: '',
  html: `
    <div style="
      width: 34px;
      height: 34px;
      background: #712ae2;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 6px 18px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
      "></div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -32],
})

export default function Community() {
  const [posts, setPosts] = useState(SEED_POSTS)
  const [composing, setComposing] = useState(false)
  const [draft, setDraft] = useState('')

  const [userReactions, setUserReactions] = useState({})
  const [openComments, setOpenComments] = useState({})
  const [commentDrafts, setCommentDrafts] = useState({})

  function publish() {
    const text = draft.trim()

    if (!text) return

    setPosts([
      {
        id: Date.now(),
        region: 'You',
        when: 'now',
        tag: 'SHARED',
        tagColor: '#059669',
        body: text,
        hearts: 0,
        supports: 0,
        comments: [],
      },
      ...posts,
    ])

    setDraft('')
    setComposing(false)
  }

  function toggleReaction(postId, reactionType) {
    const reactionKey = `${postId}-${reactionType}`
    const hasReacted = Boolean(userReactions[reactionKey])

    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) return post

        if (reactionType === 'heart') {
          return {
            ...post,
            hearts: hasReacted ? Math.max(post.hearts - 1, 0) : post.hearts + 1,
          }
        }

        if (reactionType === 'support') {
          return {
            ...post,
            supports: hasReacted ? Math.max(post.supports - 1, 0) : post.supports + 1,
          }
        }

        return post
      })
    )

    setUserReactions((currentReactions) => ({
      ...currentReactions,
      [reactionKey]: !hasReacted,
    }))
  }

  function toggleComments(postId) {
    setOpenComments((current) => ({
      ...current,
      [postId]: !current[postId],
    }))
  }

  function updateCommentDraft(postId, value) {
    setCommentDrafts((current) => ({
      ...current,
      [postId]: value,
    }))
  }

  function addComment(postId) {
    const commentText = commentDrafts[postId]?.trim()

    if (!commentText) return

    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) return post

        return {
          ...post,
          comments: [
            ...(post.comments || []),
            {
              id: Date.now(),
              when: 'now',
              body: commentText,
            },
          ],
        }
      })
    )

    setCommentDrafts((current) => ({
      ...current,
      [postId]: '',
    }))

    setOpenComments((current) => ({
      ...current,
      [postId]: true,
    }))
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 py-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          Community
          <br />
          Support
        </h1>

        <p className="mt-1 text-sm text-on-surface-variant">
          Connect with a supportive community in Mauritius. Share your thoughts anonymously and find
          professional NGO resources for your well-being.
        </p>
      </div>

      {/* Compose prompt */}
      <div className="card flex items-center justify-between !p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bookmark size={18} />
          </span>

          <p className="text-sm font-semibold text-on-surface-variant">
            What&apos;s on your mind? Share anonymously.
          </p>
        </div>

        <button onClick={() => setComposing(true)} className="btn-ai !px-4 !py-2 text-xs">
          <Plus size={14} />
          Create Anonymous Post
        </button>
      </div>

      {/* Compose box */}
      {composing && (
        <div className="card">
          <textarea
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Your post is anonymous and never linked to your identity…"
            className="input resize-none"
          />

          <div className="mt-3 flex gap-2">
            <button onClick={publish} className="btn-primary flex-1">
              Post anonymously
            </button>

            <button onClick={() => setComposing(false)} className="btn-ghost">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Posts */}
      {posts.map((p) => {
        const hasHearted = Boolean(userReactions[`${p.id}-heart`])
        const hasSupported = Boolean(userReactions[`${p.id}-support`])
        const commentsAreOpen = Boolean(openComments[p.id])
        const commentCount = p.comments?.length || 0

        return (
          <div key={p.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-high text-on-surface-variant">
                  <EyeOff size={14} />
                </span>

                <div className="text-xs">
                  <p className="font-semibold">Anonymous Peer</p>
                  <p className="text-on-surface-variant">
                    {p.when} • {p.region}
                  </p>
                </div>
              </div>

              <Chip color={p.tagColor}>{p.tag}</Chip>
            </div>

            <p className="mt-3 text-sm text-on-surface">{p.body}</p>

            {/* Reactions */}
            <div className="mt-3 flex gap-3 text-xs text-on-surface-variant">
              <button
                type="button"
                onClick={() => toggleReaction(p.id, 'heart')}
                className={`flex items-center gap-1 rounded-full px-3 py-2 transition ${
                  hasHearted
                    ? 'bg-red-50 font-semibold text-red-600'
                    : 'bg-surface-high text-on-surface-variant'
                }`}
              >
                <Heart
                  size={14}
                  className={hasHearted ? 'fill-red-600 text-red-600' : 'text-red-600'}
                />
                {p.hearts}
              </button>

              <button
                type="button"
                onClick={() => toggleReaction(p.id, 'support')}
                className={`flex items-center gap-1 rounded-full px-3 py-2 transition ${
                  hasSupported
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'bg-surface-high text-on-surface-variant'
                }`}
              >
                <Smile size={14} className="text-primary" />
                {p.supports}
              </button>

              <button
                type="button"
                onClick={() => toggleComments(p.id)}
                className={`flex items-center gap-1 rounded-full px-3 py-2 transition ${
                  commentsAreOpen
                    ? 'bg-secondary/10 font-semibold text-secondary'
                    : 'bg-surface-high text-on-surface-variant'
                }`}
              >
                <MessageCircle size={14} className="text-secondary" />
                {commentCount}
              </button>
            </div>

            {/* Comments */}
            {commentsAreOpen && (
              <div className="mt-4 border-t border-outline-variant/40 pt-4">
                <div className="space-y-3">
                  {commentCount > 0 ? (
                    p.comments.map((comment) => (
                      <div key={comment.id} className="rounded-xl bg-surface-high p-3">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <EyeOff size={12} />
                          </span>

                          <div>
                            <p className="font-semibold text-on-surface">Anonymous Peer</p>
                            <p className="text-on-surface-variant">{comment.when}</p>
                          </div>
                        </div>

                        <p className="mt-2 text-sm text-on-surface">{comment.body}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-on-surface-variant">
                      No comments yet. Be the first to reply anonymously.
                    </p>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    value={commentDrafts[p.id] || ''}
                    onChange={(e) => updateCommentDraft(p.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addComment(p.id)
                      }
                    }}
                    placeholder="Write an anonymous comment…"
                    className="input flex-1"
                  />

                  <button
                    type="button"
                    onClick={() => addComment(p.id)}
                    className="btn-primary !px-3"
                    aria-label="Send comment"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Live Support Map */}
      <div className="card overflow-hidden !p-0">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-bold">Support Map</h2>

          <span className="rounded-md bg-secondary/10 px-2 py-1 text-xs font-semibold text-secondary">
            Mauritius
          </span>
        </div>

        <div className="relative h-72 overflow-hidden border-t border-outline-variant/40">
          <MapContainer
            center={mauritiusCenter}
            zoom={10}
            scrollWheelZoom={false}
            zoomControl={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {MAP_SERVICES.map((service) => (
              <Marker key={service.name} position={service.position} icon={customMarker}>
                <Popup>
                  <div className="space-y-1">
                    <p className="font-bold">{service.name}</p>
                    <p className="text-xs">{service.services}</p>
                    <p className="text-xs">
                      <strong>Location:</strong> {service.region}
                    </p>
                    <a
                      href={`tel:${service.phone.replace(/\s/g, '')}`}
                      className="text-xs font-bold text-purple-700"
                    >
                      {service.phone}
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-md bg-surface px-3 py-2 text-xs font-semibold text-on-surface shadow-sm">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
            24/7 Hotlines Available
          </div>
        </div>
      </div>

      {/* Support directory */}
      <div className="pt-2">
        <h2 className="text-lg font-bold">Youth & Mental Health Services</h2>

        <div className="mt-3 space-y-3">
          {SUPPORT_SERVICES.map((s) => (
            <div key={s.name} className="card flex items-center justify-between !p-4">
              <div>
                <p className="font-semibold">{s.name}</p>

                <p className="text-xs text-on-surface-variant">Services: {s.services}</p>

                <div className="mt-2 flex items-center gap-3 text-xs">
                  <a
                    href={`tel:${s.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-1 font-semibold text-secondary"
                  >
                    <Phone size={12} />
                    {s.phone}
                  </a>

                  <span className="flex items-center gap-1 text-on-surface-variant">
                    <MapPin size={12} />
                    {s.region}
                  </span>
                </div>
              </div>

              <ChevronRight size={18} className="text-outline-variant" />
            </div>
          ))}
        </div>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setComposing(true)}
        className="fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl active:scale-95"
        aria-label="Create anonymous post"
      >
        <Plus size={30} />
      </button>
    </div>
  )
}