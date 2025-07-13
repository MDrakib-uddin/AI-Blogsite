import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  // Fetch all tracks, courses, modules, lessons (nested)
  const { data: tracks } = await supabase.from('tracks').select('*')
  const { data: courses } = await supabase.from('courses').select('*')
  const { data: modules } = await supabase.from('modules').select('*')
  const { data: lessons } = await supabase.from('lessons').select('*')

  // Default to empty arrays if null
  const safeTracks = tracks || []
  const safeCourses = courses || []
  const safeModules = modules || []
  const safeLessons = lessons || []

  // Nest the data
  const nested = safeTracks.map(track => ({
    ...track,
    courses: safeCourses.filter(c => c.track_id === track.id).map(course => ({
      ...course,
      modules: safeModules.filter(m => m.course_id === course.id).map(module => ({
        ...module,
        lessons: safeLessons.filter(l => l.module_id === module.id)
      }))
    }))
  }))

  return NextResponse.json(nested)
} 