# Gym Log 💪

A mobile-first workout tracker built to visualize progress and maintain consistency.
Designed with a focus on quick data entry and automated statistical analysis.

## 🚀 Live Demo

[Gym Log](https://gym-log-wheat.vercel.app)

## 📱 Features

- **Mobile-First Design:** Optimized for usage on the go while at the gym.
- **Smart Logging:** Tracks muscle groups, cardio sessions (time/distance), and dates.
- **Visual Analytics:**
  - Automatic calculation of active days and total volume.
  - Muscle group breakdown (e.g., "Legs: 4 sessions").
  - Cardio totals (Total km ran, total minutes active).
- **User Authentication:** Secure login via Google OAuth or Magic Link (Supabase Auth).
- **Full CRUD:** Users can Create, Read, Update, and Delete their workout logs.
- **Row Level Security (RLS):** Database policies ensure users can only access their own data.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Backend / Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Deployment:** Vercel

## ⚙️ Local Setup

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/YOUR_USERNAME/gym-log.git](https://github.com/YOUR_USERNAME/gym-log.git)
    cd gym-log
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory and add your Supabase credentials:

    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_KEY=your_anon_key
    ```

4.  **Run the app**
    ```bash
    npm run dev
    ```

## 🗄️ Database Schema

The app uses a single robust PostgreSQL table with RLS enabled:

```sql
create table activities (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date date not null,
  activity_ids text[] not null, -- Stores array of muscle groups ['chest', 'triceps']
  is_cardio boolean default false,
  cardio_time numeric,
  cardio_distance numeric,
  user_id uuid references auth.users not null default auth.uid()
);
```
