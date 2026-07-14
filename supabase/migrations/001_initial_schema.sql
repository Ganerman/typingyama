create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) between 3 and 32),
  full_name text default '',
  avatar_url text default '',
  bio text default '',
  school text default '',
  country text default '',
  total_xp integer not null default 0 check (total_xp >= 0),
  coins integer not null default 0 check (coins >= 0),
  level integer not null default 1 check (level >= 1),
  current_rank text not null default 'Beginner',
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_active_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.typing_tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mode text not null check (mode in ('Classic', 'Race', 'Word Rain', 'Code', 'Student', 'Daily Challenge')),
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard', 'Expert')),
  language text not null check (language in ('English', 'Filipino', 'Cebuano')),
  duration integer not null check (duration > 0),
  wpm numeric(6,2) not null check (wpm >= 0),
  raw_wpm numeric(6,2) not null check (raw_wpm >= 0),
  accuracy numeric(5,2) not null check (accuracy >= 0 and accuracy <= 100),
  correct_characters integer not null check (correct_characters >= 0),
  incorrect_characters integer not null check (incorrect_characters >= 0),
  total_characters integer not null check (total_characters >= 0),
  xp_earned integer not null default 0 check (xp_earned >= 0),
  completed_at timestamptz not null default now()
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text not null,
  icon text not null,
  requirement_type text not null,
  requirement_value integer not null check (requirement_value >= 0),
  xp_reward integer not null default 0 check (xp_reward >= 0)
);

create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create table public.daily_challenges (
  id uuid primary key default gen_random_uuid(),
  challenge_date date unique not null,
  text_content text not null,
  required_wpm integer not null check (required_wpm >= 0),
  required_accuracy numeric(5,2) not null check (required_accuracy between 0 and 100),
  xp_reward integer not null default 0 check (xp_reward >= 0),
  coin_reward integer not null default 0 check (coin_reward >= 0)
);

create table public.daily_challenge_results (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.daily_challenges(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  wpm numeric(6,2) not null check (wpm >= 0),
  accuracy numeric(5,2) not null check (accuracy between 0 and 100),
  completed boolean not null default false,
  completed_at timestamptz not null default now(),
  unique (challenge_id, user_id)
);

create table public.race_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  position integer not null check (position > 0),
  wpm numeric(6,2) not null check (wpm >= 0),
  accuracy numeric(5,2) not null check (accuracy between 0 and 100),
  race_duration integer not null check (race_duration > 0),
  xp_earned integer not null default 0 check (xp_earned >= 0),
  completed_at timestamptz not null default now()
);

create table public.word_rain_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null check (score >= 0),
  level_reached integer not null check (level_reached > 0),
  words_typed integer not null check (words_typed >= 0),
  highest_combo integer not null check (highest_combo >= 0),
  completed_at timestamptz not null default now()
);

create index typing_tests_user_completed_idx on public.typing_tests(user_id, completed_at desc);
create index typing_tests_leaderboard_idx on public.typing_tests(wpm desc, accuracy desc);
create index profiles_xp_idx on public.profiles(total_xp desc);
create index daily_challenge_results_challenge_idx on public.daily_challenge_results(challenge_id, wpm desc, accuracy desc);
create index race_results_position_idx on public.race_results(position, wpm desc);
create index word_rain_scores_score_idx on public.word_rain_scores(score desc);

alter table public.profiles enable row level security;
alter table public.typing_tests enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.daily_challenges enable row level security;
alter table public.daily_challenge_results enable row level security;
alter table public.race_results enable row level security;
alter table public.word_rain_scores enable row level security;

create policy "profiles are publicly readable" on public.profiles for select using (true);
create policy "users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "typing tests readable for leaderboard" on public.typing_tests for select using (true);
create policy "users insert own typing tests" on public.typing_tests for insert with check (auth.uid() = user_id);
create policy "users update own typing tests" on public.typing_tests for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users delete own typing tests" on public.typing_tests for delete using (auth.uid() = user_id);

create policy "achievements readable" on public.achievements for select using (true);
create policy "user achievements readable" on public.user_achievements for select using (true);
create policy "users insert own achievements" on public.user_achievements for insert with check (auth.uid() = user_id);

create policy "daily challenges readable" on public.daily_challenges for select using (true);
create policy "daily results readable" on public.daily_challenge_results for select using (true);
create policy "users insert own daily results" on public.daily_challenge_results for insert with check (auth.uid() = user_id);
create policy "users update own daily results" on public.daily_challenge_results for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "race results readable" on public.race_results for select using (true);
create policy "users insert own race results" on public.race_results for insert with check (auth.uid() = user_id);
create policy "word rain scores readable" on public.word_rain_scores for select using (true);
create policy "users insert own word rain scores" on public.word_rain_scores for insert with check (auth.uid() = user_id);

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.handle_updated_at();
