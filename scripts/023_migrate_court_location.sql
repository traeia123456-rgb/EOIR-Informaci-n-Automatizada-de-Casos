-- Migrar datos de court_location a court_address
UPDATE immigration_cases
SET court_address = court_location
WHERE (court_address IS NULL OR court_address = '')
AND court_location IS NOT NULL
AND court_location != '';

-- Verificar la migración
SELECT registration_number, court_location, court_address
FROM immigration_cases
WHERE court_location IS NOT NULL
OR court_address IS NOT NULL;