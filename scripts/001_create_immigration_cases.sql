-- Crear tabla para casos de inmigración
CREATE TABLE IF NOT EXISTS public.immigration_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number VARCHAR(9) UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  appeal_received_date DATE,
  appeal_status TEXT DEFAULT 'pending',
  brief_status_respondent TEXT,
  brief_status_dhs TEXT,
  court_address TEXT,
  court_phone TEXT,
  next_hearing_date DATE,
  next_hearing_info TEXT,
  judicial_decision TEXT,
  decision_date DATE,
  decision_court_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE immigration_cases ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (for case lookup)
CREATE POLICY "Public can read immigration cases" ON immigration_cases
  FOR SELECT USING (true);

-- Policy for admins to manage immigration cases
CREATE POLICY "Admins can manage immigration cases" ON immigration_cases
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Insertar datos de ejemplo basados en las capturas de pantalla
INSERT INTO public.immigration_cases (
  registration_number,
  full_name,
  appeal_received_date,
  appeal_status,
  brief_status_respondent,
  brief_status_dhs,
  court_address,
  court_phone,
  next_hearing_info,
  judicial_decision,
  decision_date,
  decision_court_address
) VALUES (
  '215709190',
  'SANABRIA-ORELLANA, CLAUDIA JOSSELIN',
  '2024-03-14',
  'pending',
  'Todavía no se ha fijado una fecha límite para la presentación de escritos legales.',
  'Todavía no se ha fijado una fecha límite para la presentación de escritos legales.',
  'OFFICE OF THE CHIEF CLERK\n5107 LEESBURG PIKE, SUITE 2000\nFALLS CHURCH, VA 22041',
  '(703) 605-1007',
  'No hay audiencias futuras para este caso.',
  'El juez de inmigración ORDENÓ la expulsión.',
  '2024-02-29',
  '500 JEFFERSON ST., SUITE 300\nHOUSTON, TX 77002'
);

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_immigration_cases_registration_number 
ON public.immigration_cases(registration_number);
