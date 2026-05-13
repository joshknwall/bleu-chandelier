-- ═══ SEED DEMO ROOMS ═══

-- Demo clients
INSERT INTO clients (id, name, email, avatar_url, status, event_type) VALUES
('a1000000-0000-0000-0000-000000000001', 'Amara Whitfield', 'amara@example.com', 'https://randomuser.me/api/portraits/women/44.jpg', 'active', 'wedding'),
('a1000000-0000-0000-0000-000000000002', 'Priya Nair',      'priya@example.com', 'https://randomuser.me/api/portraits/women/63.jpg', 'active', 'corporate'),
('a1000000-0000-0000-0000-000000000003', 'Celeste Fontaine', 'celeste@example.com', 'https://randomuser.me/api/portraits/women/68.jpg', 'planning', 'gala');

-- Demo events
INSERT INTO events (id, client_id, name, date, guest_count, status, budget) VALUES
('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Whitfield Wedding',  '2026-06-14', 220, 'active',  85000),
('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'Nair Brand Launch', '2026-05-02', 150, 'active',  45000),
('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 'Fontaine Gala',     '2026-08-22', 300, 'planning', 120000);

-- Demo rooms
INSERT INTO rooms (id, client_id, event_id, template_id, livekit_room, status) VALUES
('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'discovery-call',    'bc-demo0001', 'active'),
('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'design-review',     'bc-demo0002', 'active'),
('c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'final-walkthrough', 'bc-demo0003', 'active'),
('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'vendor-meet',       'bc-demo0004', 'active'),
('c1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'day-of-briefing',   'bc-demo0005', 'active');
