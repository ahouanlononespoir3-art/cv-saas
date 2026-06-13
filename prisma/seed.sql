-- prisma/seed.sql
-- Run after prisma migrate dev

-- Initial plans configuration (stored in app config, but useful for reference)
-- FREE: 2 CV/month, 2 letters/month
-- PREMIUM: Unlimited CV, letters, all templates, PDF+DOCX export

-- Example admin user (change password before production!)
-- INSERT INTO users (id, name, email, password, plan, "createdAt", "updatedAt")
-- VALUES (
--   'admin-user-id',
--   'Admin',
--   'admin@cvpro.ai',
--   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMlJbekRSrutE4e.OuAl0pUaC2', -- password: admin123
--   'PREMIUM',
--   NOW(),
--   NOW()
-- );
