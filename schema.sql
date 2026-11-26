-- Branch 4 Student Council Portal — PostgreSQL Schema (Neon-ready)

CREATE TYPE major_code AS ENUM ('math', 'physics', 'cs', 'all');
CREATE TYPE lang_code AS ENUM ('en', 'fr');
CREATE TYPE doc_type AS ENUM ('Dawrat', 'Course', 'Exercises', 'Solutions', 'Book', 'Syllabus');
CREATE TYPE doc_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE event_category AS ENUM ('class', 'exam', 'holiday', 'event');
CREATE TYPE editor_role AS ENUM ('council', 'professor', 'delegate', 'directory');

-- Password-Based Admin & Professor Auth (Store bcrypt/argon2id hashes, never plaintext)
CREATE TABLE admin_accounts (
  id             SERIAL PRIMARY KEY,
  role           editor_role NOT NULL,
  display_name   TEXT NOT NULL,
  email          TEXT UNIQUE,
  password_hash  TEXT NOT NULL,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cours (SQL Metadata; actual PDFs live in Cloudflare R2)
CREATE TABLE cours_documents (
  id             SERIAL PRIMARY KEY,
  branch         TEXT NOT NULL DEFAULT 'Branch 4',
  major          major_code NOT NULL,
  language       lang_code NOT NULL,
  academic_year  SMALLINT NOT NULL CHECK (academic_year BETWEEN 1 AND 5),
  semester       TEXT NOT NULL,
  course_code    TEXT NOT NULL,
  course_name    TEXT NOT NULL,
  doc_type       doc_type NOT NULL,
  title          TEXT NOT NULL,
  storage_key    TEXT NOT NULL UNIQUE,
  file_size_kb   INT,
  uploader_label TEXT NOT NULL DEFAULT 'Branch 4 Student',
  status         doc_status NOT NULL DEFAULT 'pending',
  verified_by    INT REFERENCES admin_accounts(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calendar (Filterable by Major, Year, Professor, and Layer)
CREATE TABLE calendar_events (
  id             SERIAL PRIMARY KEY,
  branch         TEXT NOT NULL DEFAULT 'Branch 4',
  major          major_code NOT NULL DEFAULT 'all',
  academic_year  SMALLINT CHECK (academic_year BETWEEN 1 AND 5),
  professor_id   INT REFERENCES admin_accounts(id) ON DELETE SET NULL,
  category       event_category NOT NULL,
  title          TEXT NOT NULL,
  location       TEXT NOT NULL,
  starts_at      TIMESTAMPTZ NOT NULL,
  ends_at        TIMESTAMPTZ,
  note           TEXT,
  updated_by     INT NOT NULL REFERENCES admin_accounts(id),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Verified Announcements (Role-tagged feed)
CREATE TABLE announcements (
  id             SERIAL PRIMARY KEY,
  branch         TEXT NOT NULL DEFAULT 'Branch 4',
  author_id      INT NOT NULL REFERENCES admin_accounts(id),
  author_role    editor_role NOT NULL,
  title          TEXT NOT NULL,
  body           TEXT NOT NULL,
  is_pinned      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Offers & Student Discounts
CREATE TABLE student_offers (
  id             SERIAL PRIMARY KEY,
  partner_name   TEXT NOT NULL,
  category       TEXT NOT NULL,
  discount_label TEXT NOT NULL,
  promo_code     TEXT,
  location       TEXT NOT NULL,
  details        TEXT NOT NULL,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_by     INT REFERENCES admin_accounts(id) ON DELETE SET NULL
);

-- Dynamic Custom Windows (Council Admin Only)
CREATE TABLE custom_pages (
  id             SERIAL PRIMARY KEY,
  slug           TEXT NOT NULL UNIQUE,
  label          TEXT NOT NULL,
  short_desc     TEXT,
  sections_json  JSONB NOT NULL DEFAULT '[]',
  created_by     INT NOT NULL REFERENCES admin_accounts(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cours_filter ON cours_documents (status, language, major, academic_year, doc_type);
CREATE INDEX idx_cours_code   ON cours_documents (course_code);
CREATE INDEX idx_cal_filter   ON calendar_events (major, academic_year, professor_id, starts_at);
