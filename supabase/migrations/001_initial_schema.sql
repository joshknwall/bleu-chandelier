-- ═══ BLEU CHANDELIER — INITIAL SCHEMA ═══

-- Clients
CREATE TABLE clients (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT,
  phone         TEXT,
  event_type    TEXT,
  status        TEXT DEFAULT 'inquiry',
  avatar_url    TEXT,
  budget_range  TEXT,
  notes         TEXT,
  auth_user_id  UUID,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Events
CREATE TABLE events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID REFERENCES clients(id),
  name          TEXT NOT NULL,
  date          DATE,
  venue         TEXT,
  guest_count   INT,
  status        TEXT DEFAULT 'planning',
  budget        NUMERIC(10,2),
  spent         NUMERIC(10,2) DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Room Templates
CREATE TABLE room_templates (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  duration_min  INT NOT NULL,
  icon          TEXT,
  prep_notes    TEXT,
  tools         TEXT[],
  agenda_items  TEXT[] NOT NULL
);

-- Rooms
CREATE TABLE rooms (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID REFERENCES clients(id),
  event_id      UUID REFERENCES events(id),
  template_id   TEXT REFERENCES room_templates(id),
  livekit_room  TEXT UNIQUE,
  status        TEXT DEFAULT 'active',
  pinned        BOOLEAN DEFAULT false,
  setup         JSONB DEFAULT '{}'::jsonb,
  permissions   JSONB DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Room Sessions
CREATE TABLE room_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id       UUID REFERENCES rooms(id) ON DELETE CASCADE,
  started_at    TIMESTAMPTZ DEFAULT now(),
  ended_at      TIMESTAMPTZ,
  recording_url TEXT,
  recording_status TEXT DEFAULT 'none',
  egress_id     TEXT,
  summary       TEXT
);

-- Session Participants
CREATE TABLE session_participants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID REFERENCES room_sessions(id) ON DELETE CASCADE,
  display_name  TEXT NOT NULL,
  role          TEXT DEFAULT 'guest',
  joined_at     TIMESTAMPTZ DEFAULT now(),
  left_at       TIMESTAMPTZ
);

-- Session Agenda Items
CREATE TABLE session_agenda_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID REFERENCES room_sessions(id) ON DELETE CASCADE,
  text          TEXT NOT NULL,
  completed     BOOLEAN DEFAULT false,
  sort_order    INT NOT NULL,
  completed_at  TIMESTAMPTZ
);

-- Session Decisions
CREATE TABLE session_decisions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID REFERENCES room_sessions(id) ON DELETE CASCADE,
  text          TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Session Approvals
CREATE TABLE session_approvals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID REFERENCES room_sessions(id) ON DELETE CASCADE,
  label         TEXT NOT NULL,
  status        TEXT DEFAULT 'pending',
  decided_at    TIMESTAMPTZ
);

-- Session Notes
CREATE TABLE session_notes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID REFERENCES room_sessions(id) ON DELETE CASCADE,
  content       TEXT DEFAULT '',
  is_private    BOOLEAN DEFAULT true,
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime for session panel tables
ALTER PUBLICATION supabase_realtime ADD TABLE session_agenda_items;
ALTER PUBLICATION supabase_realtime ADD TABLE session_decisions;
ALTER PUBLICATION supabase_realtime ADD TABLE session_approvals;
ALTER PUBLICATION supabase_realtime ADD TABLE session_notes;
