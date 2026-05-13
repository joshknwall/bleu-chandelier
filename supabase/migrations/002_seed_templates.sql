-- ═══ SEED ROOM TEMPLATES ═══

INSERT INTO room_templates (id, name, duration_min, icon, prep_notes, tools, agenda_items) VALUES
('discovery-call', 'Discovery Call', 45, 'Search',
 'Review inquiry form, prepare availability calendar',
 ARRAY['Notes', 'Calendar'],
 ARRAY['Introductions & rapport building', 'Understand event vision & goals', 'Discuss budget range & guest count', 'Review available dates & venues', 'Next steps & follow-up plan']),

('design-review', 'Design Review', 60, 'Palette',
 'Update mood board, prepare floor plan draft',
 ARRAY['Mood Board', 'Floor Plan', 'Approvals'],
 ARRAY['Review mood board & color palette', 'Floor plan walkthrough', 'Table settings & centerpiece options', 'Lighting & ambiance discussion', 'Vendor visual samples', 'Client approvals']),

('final-walkthrough', 'Final Walkthrough', 90, 'CheckSquare',
 'Finalize all vendor contracts, complete timeline, print emergency contacts',
 ARRAY['Floor Plan', 'Approvals', 'Checklist', 'Contacts'],
 ARRAY['Complete timeline review', 'Vendor confirmations & contacts', 'Floor plan final approval', 'Emergency protocols review', 'Day-of communication plan', 'Final questions & concerns', 'Sign-off on all details']),

('vendor-meet', 'Vendor Meet', 30, 'Handshake',
 'Brief vendor on client preferences, prepare comparison sheet',
 ARRAY['Notes', 'Approvals'],
 ARRAY['Vendor introduction to client', 'Service overview & pricing', 'Portfolio review', 'Q&A']),

('day-of-briefing', 'Day-Of Briefing', 20, 'Clock',
 'Print timeline cards, charge all devices, test walkie-talkies',
 ARRAY['Checklist', 'Contacts'],
 ARRAY['Timeline quick review', 'Staff assignments confirmed', 'Weather & contingency check', 'Final vendor check-in']);
