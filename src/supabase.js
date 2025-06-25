import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://otbskhpvrcsgqutuuysx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90YnNraHB2cmNzZ3F1dHV1eXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTcwMTksImV4cCI6MjA2NjQzMzAxOX0.onqdZNX1lAZVbX92tFfUfaAj7689XCaEFuOeS4BXY5s'
export const supabase = createClient(supabaseUrl, supabaseKey)
