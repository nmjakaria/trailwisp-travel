# Trailwisp — Travel Booking & Story Sharing Platform

> *"Real trips. Real stories. Book what's actually true."*

Trailwisp is a travel discovery, honest story-sharing, and booking platform. This repository contains the **frontend** application, built with Next.js (App Router) and TypeScript, powered by a separate Express + MongoDB backend.

**🔗 Live Site:** *[(Visit Site)](https://trailwisp-travel-chi.vercel.app/)*
**🔗 Backend Repository:** *[(Click here)](https://github.com/nmjakaria/trailwisp-server)*

---

## ✨ Overview

Trailwisp combines verified bookable travel experiences with honest, user-written trip stories — so travelers can read a real account of a place *and* book that same experience in one platform.

### Core Features

**Public pages**
- Homepage with a hero banner, featured places, popular destinations, and a live scrolling "Latest Travel News" marquee
- **All Destinations** — search by name/location, filter by category/price/rating/location, sort (price, rating, newest, most popular), and pagination
- **Destination details** — image gallery, key info, comments, related places, and a guided booking flow
- **Story listing & details** — honest, user-written trip write-ups with filtering and sorting
- About Us, Contact, Privacy Policy, Terms, and Support pages

**Authentication**
- Email/password and Google sign-in via BetterAuth
- JWT-based session bridging so the Express backend can authorize requests independently
- Blocked-user handling — restricted accounts cannot book, comment, or publish stories

**Booking system**
- Seat selection, date/time picking (restricted to a place's actual available dates), and contact details, all inside a single modal flow
- Client-side validation before submission, with clear success/error states
- Price is calculated server-side from the place's listed price — never trusted from client input

**Social features**
- Like and wishlist destinations and stories (persisted per user, reflected across sessions)
- Comment on destinations, with admin moderation (best-comment highlighting, deletion)

**User dashboard**
- Overview of bookings, wishlist, and published stories
- Manage bookings (view status, cancel while pending)
- Manage wishlist and personal travel stories (add, edit, delete)
- Profile management

**Admin dashboard**
- Site-wide overview with Recharts visualizations (bookings over time, top destinations, category distribution)
- Manage Places — create, edit, delete, and feature destinations
- Manage Stories — feature or remove user-submitted stories
- Manage Comments — feature "best comments" or remove inappropriate ones
- Manage News — publish updates that appear in the homepage ticker
- Manage Bookings — accept, update status, or delete booking records
- Manage Users — assign roles, block/unblock accounts

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) + TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| UI Components | [HeroUI](https://www.heroui.com/) |
| Data Fetching / Caching | [TanStack Query](https://tanstack.com/query) + Next.js Server Actions |
| Forms & Validation | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Charts | [Recharts](https://recharts.org/) |
| Authentication | [BetterAuth](https://www.better-auth.com/) (email/password + Google, JWT plugin) |
| Image Hosting | [ImgBB](https://imgbb.com/) |

---

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                       # Homepage
│   ├── layout.tsx / providers.tsx     # Root layout & providers (Query, theme, etc.)
│   ├── error.tsx / not-found.tsx / loading.tsx
│   │
│   ├── about/                         # About Us
│   ├── contact/                       # Contact
│   ├── privacy/  ·  terms/  ·  support/
│   │
│   ├── destinations/
│   │   ├── page.tsx                    # All Destinations (search, filter, sort, pagination)
│   │   └── [id]/page.tsx               # Destination details (gallery, booking, comments)
│   │
│   ├── stories/
│   │   ├── page.tsx                    # Story listing
│   │   └── [id]/page.tsx               # Story details
│   │
│   ├── auth/
│   │   ├── signin/                     # Login
│   │   └── signup/                     # Register
│   │
│   ├── api/auth/[...all]/route.ts      # BetterAuth route handler
│   │
│   └── dashboard/
│       ├── layout.tsx
│       ├── user/
│       │   ├── page.tsx                 # Overview
│       │   ├── bookings/                # My Booked Places
│       │   ├── wishlist/                # My Wishlist
│       │   ├── stories/                 # My Travel Stories (+ add/)
│       │   └── my-profile/
│       └── admin/
│           ├── page.tsx                 # Admin overview & stats
│           ├── places/                  # Manage Places (+ add/, edit/[id]/)
│           ├── stories/                 # Manage Stories (+ [id]/)
│           ├── comments/                # Manage Comments
│           ├── news/                    # Manage News (ticker source)
│           ├── bookings/                # Manage Bookings
│           ├── users/                   # Manage Users
│           └── my-profile/
│
├── components/
│   ├── shared/                         # DestinationCard, ProfileView, reusable modals
│   ├── destinations/                    # BookingModal, CommentSection
│   ├── dashboard/                       # Sidebar, DashboardLayoutClient
│   │   ├── admin/                        # AddPlaceForm, AdminDashboardView, DashboardStats, PlaceCard, DeleteModal
│   │   └── user/                         # UserDashboardView
│   ├── Navbar.tsx  ·  NewsMarquee.tsx  ·  InteractiveBanner.tsx
│   ├── FAQSection.tsx  ·  NewsletterSection.tsx  ·  FooterSection.tsx
│   └── theme-switcher.tsx
│
├── lib/
│   ├── auth.ts                         # BetterAuth server configuration
│   ├── auth-client.ts                  # BetterAuth client hooks (useSession, signIn, signOut)
│   ├── constants/categories.ts         # Shared destination category list
│   ├── core/
│   │   ├── server.ts                    # Fetch/mutation helpers (publicFetch, authFetch, mutate)
│   │   └── session.ts                   # Server-side session/token helpers
│   └── api/                            # Server Actions per resource
│       ├── places.ts  ·  stories.ts  ·  bookings.ts
│       ├── comments.ts  ·  likes.ts  ·  wishlist.ts
│       ├── news.ts  ·  users.ts  ·  stats.ts
│
├── types/index.ts                      # Shared TypeScript types
├── proxy.ts                            # Request proxy configuration
└── public/
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- A running instance of the [Trailwisp backend](#) (Express + MongoDB)
- A MongoDB Atlas cluster (shared with the backend for the `user`/`session` collections used by BetterAuth)
- A Google OAuth Client ID/Secret (for social login)
- An ImgBB API key (for image uploads)

### Installation

```bash
git clone <this-repo-url>
cd trailwisp
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_random_secret_string
MONGO_DB_URI=your_mongodb_connection_string
AUTH_DB_NAME=trailwisp_db
NEXT_PUBLIC_IMAGE_UPLOAD_API=your_imgbb_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BASE_URL` | Base URL of the backend API |
| `BETTER_AUTH_URL` | URL where this frontend app runs (also used for JWKS verification on the backend) |
| `NEXT_PUBLIC_APP_URL` | Public-facing app URL |
| `BETTER_AUTH_SECRET` | Secret key for BetterAuth session signing |
| `MONGO_DB_URI` | MongoDB connection string (shared auth database) |
| `AUTH_DB_NAME` | Database name used by BetterAuth |
| `NEXT_PUBLIC_IMAGE_UPLOAD_API` | ImgBB API key for image uploads |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |

### Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

---

## 🔐 Authentication Flow

1. Users sign in via email/password or Google using **BetterAuth**, handled entirely on the frontend.
2. BetterAuth's **JWT plugin** issues a signed token containing the user's `role` and `isBlocked` status.
3. On protected API calls, the frontend attaches this token as a `Bearer` header.
4. The Express backend verifies the token against BetterAuth's JWKS endpoint and authorizes the request based on `role`.

---

## 🗄️ Database & Data Model

Trailwisp uses a single **MongoDB** database, shared between the frontend (for BetterAuth's own collections) and the Express backend (for all application data), accessed via **Mongoose** on the backend.

| Collection | Purpose | Key fields |
|---|---|---|
| `user` *(BetterAuth-managed)* | Accounts, roles, block status | `name`, `email`, `role`, `isBlocked` |
| `session` *(BetterAuth-managed)* | Active login sessions | `userId`, `token`, `expiresAt` |
| `places` | Bookable destinations | `title`, `category`, `price`, `location`, `availableDates[]`, `isFeatured` |
| `bookings` | Trip reservations | `userId`, `placeId`, `seats`, `departureDate`, `contactInfo`, `status`, `totalPrice` |
| `stories` | User-written travel write-ups | `userId`, `title`, `content`, `destinationTag`, `isFeatured` |
| `comments` | Feedback on places/stories | `userId`, `targetId`, `targetType`, `text`, `isBestComment` |
| `likes` | Like records (place or story) | `userId`, `targetId`, `targetType` |
| `wishlist` | Saved destinations per user | `userId`, `placeId` |
| `news` | Homepage ticker announcements | `title`, `content`, `badgeText`, `linkUrl` |

**Notes on the schema:**
- `user`/`session` use BetterAuth's default **singular** collection names — Mongoose's default pluralization (`users`) had to be explicitly overridden with `{ collection: 'user' }` to avoid creating a duplicate, empty collection.
- `bookings.totalPrice` is computed and stored server-side at booking time (`place.price × seats`) rather than trusted from the client, to prevent price tampering.
- `places.bookingsCount` and `likesCount` are updated via atomic `$inc` operations rather than full-document `.save()`, to avoid unrelated validation errors on unrelated fields.

---

## 🧩 Challenges & Learnings

Building Trailwisp surfaced a number of real-world integration issues worth documenting:

- **Bridging two auth systems** — BetterAuth (frontend session) and a separate Express backend needed a shared trust mechanism. This was solved with BetterAuth's JWT plugin, but required a custom `definePayload` to embed `role` and `isBlocked` into the token, since the default payload only includes core identity claims.
- **Route ordering in Express** — static routes (e.g. `/mine`, `/best`, `/latest`) must be declared *before* dynamic routes (e.g. `/:id`), or Express matches the dynamic route first and misinterprets the static path as an ID.
- **Third-party UI library API mismatches** — HeroUI's compound components (`Modal`, `Table`, `Select`) use specific prop names (`isOpen`/`onOpenChange` rather than `open`/`onClose`) and nested composition patterns (`Table.ScrollContainer` → `Table.Content` → `Table.Header`/`Table.Body`) that aren't always obvious without checking the type definitions directly.
- **Toolchain version drift** — TypeScript 7's new Go-based compiler and Next.js 16's removal of `next.config`'s `eslint` option both required adjusting build tooling mid-project, since some ecosystem tools (like `ts-node`) hadn't yet caught up with the new compiler internals.
- **Serverless deployment of a stateful API** — deploying the Express backend to Vercel required moving from a persistent `app.listen()` pattern to an exported `app` instance, and switching MongoDB connection handling to reuse a cached connection across invocations instead of opening one per request.
- **Client-server contract drift** — as backend routes and response shapes evolved (e.g. `/api/users` → `/api/admin/users`, `PUT` → `PATCH` for partial updates), keeping the frontend's Server Actions (`lib/api/*.ts`) in sync required careful cross-checking of paths, HTTP methods, and response shapes on both sides.

---

## 📄 License

This project is developed as part of a full-stack learning with typescript.