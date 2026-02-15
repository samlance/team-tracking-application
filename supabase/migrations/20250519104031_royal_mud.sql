/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - name (text)
      - created_at (timestamp)
    
    - daily_statuses
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - date (date)
      - leaves_planned (text)
      - created_at (timestamp)
    
    - tasks
      - id (uuid, primary key)
      - daily_status_id (uuid, references daily_statuses)
      - developer_id (uuid, references users)
      - start_date (date)
      - end_date (date)
      - dependency (text)
      - description (text)
      - remarks (text)
      - status (text)
      - created_at (timestamp)
    
    - deployments
      - id (uuid, primary key)
      - squad_number (text)
      - details (text)
      - environment (text)
      - date (date)
      - status (text)
      - created_at (timestamp)
    
    - sonar_fixes
      - id (uuid, primary key)
      - severity (text)
      - assignee_id (uuid, references users)
      - start_date (date)
      - end_date (date)
      - remarks (text)
      - status (text)
      - created_at (timestamp)
    
    - unit_test_improvements
      - id (uuid, primary key)
      - component_name (text)
      - assignee_id (uuid, references users)
      - start_date (date)
      - end_date (date)
      - current_coverage (numeric)
      - improved_coverage (numeric)
      - remarks (text)
      - status (text)
      - created_at (timestamp)
    
    - sprints
      - id (uuid, primary key)
      - name (text)
      - start_date (date)
      - end_date (date)
      - status (text)
      - created_at (timestamp)
    
    - sprint_items
      - id (uuid, primary key)
      - type (text)
      - title (text)
      - assignee_id (uuid, references users)
      - status (text)
      - sprint_id (uuid, references sprints)
      - created_at (timestamp)
    
    - merge_requests
      - id (uuid, primary key)
      - mr_id (text)
      - requestor_id (uuid, references users)
      - reviewer_id (uuid, references users)
      - description (text)
      - status (text)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Daily Statuses table
CREATE TABLE daily_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  date date NOT NULL,
  leaves_planned text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read daily statuses"
  ON daily_statuses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage their daily statuses"
  ON daily_statuses
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE id = user_id))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE id = user_id));

-- Tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_status_id uuid REFERENCES daily_statuses NOT NULL,
  developer_id uuid REFERENCES users NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  dependency text,
  description text NOT NULL,
  remarks text,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage their tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE id = developer_id))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE id = developer_id));

-- Deployments table
CREATE TABLE deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_number text NOT NULL,
  details text NOT NULL,
  environment text NOT NULL,
  date date NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read deployments"
  ON deployments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage deployments"
  ON deployments
  FOR ALL
  TO authenticated
  USING (true);

-- Sonar Fixes table
CREATE TABLE sonar_fixes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  severity text NOT NULL,
  assignee_id uuid REFERENCES users NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  remarks text,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sonar_fixes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read sonar fixes"
  ON sonar_fixes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage their sonar fixes"
  ON sonar_fixes
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE id = assignee_id))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE id = assignee_id));

-- Unit Test Improvements table
CREATE TABLE unit_test_improvements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  component_name text NOT NULL,
  assignee_id uuid REFERENCES users NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  current_coverage numeric NOT NULL,
  improved_coverage numeric NOT NULL,
  remarks text,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE unit_test_improvements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read unit test improvements"
  ON unit_test_improvements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage their unit test improvements"
  ON unit_test_improvements
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE id = assignee_id))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE id = assignee_id));

-- Sprints table
CREATE TABLE sprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read sprints"
  ON sprints
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage sprints"
  ON sprints
  FOR ALL
  TO authenticated
  USING (true);

-- Sprint Items table
CREATE TABLE sprint_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  assignee_id uuid REFERENCES users NOT NULL,
  status text NOT NULL,
  sprint_id uuid REFERENCES sprints NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sprint_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read sprint items"
  ON sprint_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage their sprint items"
  ON sprint_items
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE id = assignee_id))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE id = assignee_id));

-- Merge Requests table
CREATE TABLE merge_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mr_id text NOT NULL,
  requestor_id uuid REFERENCES users NOT NULL,
  reviewer_id uuid REFERENCES users NOT NULL,
  description text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE merge_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read merge requests"
  ON merge_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage their merge requests"
  ON merge_requests
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE id = requestor_id))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE id = requestor_id));