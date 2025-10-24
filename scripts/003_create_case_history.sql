-- Create case history table for tracking all changes
CREATE TABLE IF NOT EXISTS case_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES immigration_cases(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES admin_users(id),
  action_type VARCHAR(50) NOT NULL, -- 'created', 'updated', 'status_changed', 'note_added', etc.
  field_changed VARCHAR(100), -- which field was changed
  old_value TEXT, -- previous value
  new_value TEXT, -- new value
  notes TEXT, -- additional notes or comments
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for case history
ALTER TABLE case_history ENABLE ROW LEVEL SECURITY;

-- Policy for admins to read case history
CREATE POLICY "Admins can read case history" ON case_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policy for admins to insert case history
CREATE POLICY "Admins can insert case history" ON case_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create case notes table for additional tracking
CREATE TABLE IF NOT EXISTS case_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES immigration_cases(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES admin_users(id),
  note_type VARCHAR(50) DEFAULT 'general', -- 'general', 'important', 'reminder', 'alert'
  title VARCHAR(255),
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  reminder_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for case notes
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage case notes
CREATE POLICY "Admins can manage case notes" ON case_notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_case_history_case_id ON case_history(case_id);
CREATE INDEX IF NOT EXISTS idx_case_history_created_at ON case_history(created_at);
CREATE INDEX IF NOT EXISTS idx_case_notes_case_id ON case_notes(case_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_reminder_date ON case_notes(reminder_date);

-- Create function to automatically log case changes
CREATE OR REPLACE FUNCTION log_case_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log status changes
  IF OLD.case_status IS DISTINCT FROM NEW.case_status THEN
    INSERT INTO case_history (case_id, action_type, field_changed, old_value, new_value)
    VALUES (NEW.id, 'status_changed', 'case_status', OLD.case_status, NEW.case_status);
  END IF;
  
  -- Log other field changes
  IF OLD.full_name IS DISTINCT FROM NEW.full_name THEN
    INSERT INTO case_history (case_id, action_type, field_changed, old_value, new_value)
    VALUES (NEW.id, 'field_updated', 'full_name', OLD.full_name, NEW.full_name);
  END IF;
  
  IF OLD.court_location IS DISTINCT FROM NEW.court_location THEN
    INSERT INTO case_history (case_id, action_type, field_changed, old_value, new_value)
    VALUES (NEW.id, 'field_updated', 'court_location', OLD.court_location, NEW.court_location);
  END IF;
  
  IF OLD.next_hearing_date IS DISTINCT FROM NEW.next_hearing_date THEN
    INSERT INTO case_history (case_id, action_type, field_changed, old_value, new_value)
    VALUES (NEW.id, 'field_updated', 'next_hearing_date', OLD.next_hearing_date::text, NEW.next_hearing_date::text);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic logging
DROP TRIGGER IF EXISTS trigger_log_case_changes ON immigration_cases;
CREATE TRIGGER trigger_log_case_changes
  AFTER UPDATE ON immigration_cases
  FOR EACH ROW
  EXECUTE FUNCTION log_case_changes();
