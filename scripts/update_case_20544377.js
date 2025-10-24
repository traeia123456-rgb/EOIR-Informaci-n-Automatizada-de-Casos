/* eslint-disable */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yzcjuebvmvxeigwnchcv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Y2p1ZWJ2bXZ4ZWlnd25jaGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMTEzOTIsImV4cCI6MjA3MTU4NzM5Mn0.XlqkZ8-WPdDP5Sxy4L3MNOL4NH8tIsndTlr9yquFjU8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCase() {
  const registrationNumber = '20544377';
  const nationality = 'MX';
  const fullName = 'José González';

  const updates = {
    registration_number: registrationNumber,
    nationality: nationality,
    full_name: fullName,
    // Matching screenshot content approximations
    appeal_received_date: '2024-06-15',
    brief_status_respondent: 'Pending',
    brief_status_dhs: 'Pending',
    next_hearing_info: null, // To show "No hay audiencias futuras"
    judicial_decision: '*Motion to terminate proceedings* denied on grounds that respondent failed to establish eligibility for relief.',
    decision_date: '2024-06-15',
    decision_court_address: 'Executive Office for Immigration Review\nBoard of Immigration Appeals\n5107 Leesburg Pike, Suite 2000\nFalls Church, Virginia 20530',
    court_address: 'Executive Office for Immigration Review\nFalls Church Immigration Court\n5107 Leesburg Pike, Suite 2500\nFalls Church, VA 20530',
    court_phone: '(703) 756-6226'
  };

  const { data, error } = await supabase
    .from('immigration_cases')
    .upsert(updates, { onConflict: 'registration_number' })
    .select();

  if (error) {
    console.error('Error updating case:', error);
  } else {
    console.log('Case updated successfully:', data);
  }
}

updateCase();