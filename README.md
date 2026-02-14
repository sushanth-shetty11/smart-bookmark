# 🔖 Smart Bookmark

A simple, real-time bookmark manager built using **Next.js (App Router) + Supabase**.
Users can securely log in with Google and manage personal bookmarks with instant cross-tab synchronization.

---

## 🚀 Live Demo

Vercel URL: https://smart-bookmark-lime.vercel.app/
GitHub Repo:

---

## ✨ Features

* 🔐 Google OAuth Authentication
* ➕ Add bookmarks
* ✏️ Edit bookmarks
* 🗑️ Delete bookmarks
* ⚡ Real-time updates across multiple tabs/devices
* 🧠 User-specific data isolation using Row Level Security (RLS)
* 📱 Clean and responsive UI

---

## 🛠 Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Backend:** Supabase (Database, Auth, Realtime)
* **Deployment:** Vercel

---

## 🗄 Database Design

Table: `bookmarks`

| Column     | Type      |
| ---------- | --------- |
| id         | uuid      |
| user_id    | uuid      |
| title      | text      |
| url        | text      |
| created_at | timestamp |

Each bookmark belongs to a specific authenticated user.

---

## 🔐 Security (RLS Policies)

Row Level Security ensures users can only access their own bookmarks:

* SELECT → only own data
* INSERT → only for logged in user
* UPDATE → only own rows
* DELETE → only own rows

---

## ⚡ Realtime Functionality

Supabase realtime subscriptions are used to synchronize data instantly across tabs.

Examples:

* Add bookmark in Tab A → appears in Tab B instantly
* Edit bookmark → updates everywhere
* Delete bookmark → removes everywhere without refresh

---

## 🧩 Problems Faced & Solutions

### 1. New to Supabase

Initially I was unfamiliar with how Supabase handles:

* authentication sessions
* row level security
* realtime subscriptions

I learned how client-side auth tokens interact with database policies and why queries fail without proper RLS configuration.

---

### 2. Insert Failing (RLS violation)

**Problem:**
`new row violates row-level security policy`

**Cause:**
`user_id` was not matching the authenticated user.

**Solution:**
Configured RLS policy using:

```
auth.uid() = user_id
```

and set default value of `user_id` properly from the logged-in session.

---

### 3. Duplicate Key Error

**Problem:**
Only one bookmark could be inserted.

**Cause:**
A unique constraint accidentally existed on `user_id`.

**Solution:**
Removed incorrect unique constraint so each user can store multiple bookmarks.

---

### 4. Delete Not Updating in Realtime (Major Issue)

**Problem:**
Delete worked in the same tab but not in other tabs unless refreshed.

**Cause:**
Supabase realtime DELETE events only send the row `id`, not full row data.
My code was filtering by `user_id`, so the event was ignored.

**Solution:**
Instead of filtering by `user_id`, the UI now removes the bookmark if the deleted `id` exists in local state.
This made cross-tab delete fully realtime.

---

### 5. Realtime Subscription Issues

**Problem:**
Subscriptions stopped working after refactoring.

**Cause:**
Multiple hooks were managing realtime and state separately causing lifecycle conflicts.

**Solution:**
Created a single `useBookmarks` hook responsible for:

* fetching
* realtime subscription
* CRUD operations
* cleanup

This stabilized realtime updates.

---

## 📚 What I Learned

* How authentication works with database authorization (RLS)
* Managing realtime subscriptions safely in React
* Handling optimistic UI updates
* Debugging production-level async behavior
* Structuring a maintainable Next.js App Router project

---

## 🧪 How to Run Locally

```bash
git clone <repo>
cd smart-bookmark
npm install
npm run dev
```

Add environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

## 📌 Conclusion

This project demonstrates a full-stack real-time application using modern web technologies.
The focus was not just functionality, but also security, reliability, and real-world debugging.

---
