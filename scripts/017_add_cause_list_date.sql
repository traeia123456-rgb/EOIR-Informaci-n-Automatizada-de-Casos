-- Add cause_list_date column to immigration_cases table
ALTER TABLE immigration_cases 
ADD COLUMN cause_list_date DATE;