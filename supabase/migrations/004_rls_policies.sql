-- ═══ ROW LEVEL SECURITY POLICIES ═══
-- Permissive policies for development. Restrict when auth is implemented.

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_agenda_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY allow_all_clients ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY allow_all_events ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY allow_all_rooms ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY allow_all_room_templates ON room_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY allow_all_room_sessions ON room_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY allow_all_session_participants ON session_participants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY allow_all_session_agenda_items ON session_agenda_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY allow_all_session_decisions ON session_decisions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY allow_all_session_approvals ON session_approvals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY allow_all_session_notes ON session_notes FOR ALL USING (true) WITH CHECK (true);
