CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Applied',
  application_date DATE,
  job_link TEXT,
  notes TEXT,
  follow_up_date DATE
);

CREATE TABLE application_history (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL
    REFERENCES applications(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);