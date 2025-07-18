"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface Lesson { id: string; name: string; content: string; module_id: string; }
interface Module { id: string; name: string; description: string; course_id: string; lessons: Lesson[]; }
interface Course { id: string; name: string; description: string; track_id: string; modules: Module[]; courseLessons?: Lesson[]; }
interface Track { id: string; name: string; description: string; courses: Course[]; trackLessons?: Lesson[]; }

export default function LearningPathAdmin() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  // Accordion state
  // Add forms
  const [addTrack, setAddTrack] = useState({ name: "", description: "" })
  const [addCourse, setAddCourse] = useState<{ [trackId: string]: { name: string; description: string } }>({})
  const [addModule, setAddModule] = useState<{ [courseId: string]: { name: string; description: string } }>({})
  const [addLesson, setAddLesson] = useState<{ [moduleId: string]: { name: string; content: string } }>({})

  // Edit state
  const [editTrack, setEditTrack] = useState<{ id: string; name: string; description: string } | null>(null)
  const [editCourse, setEditCourse] = useState<{ id: string; name: string; description: string } | null>(null)
  const [editModule, setEditModule] = useState<{ id: string; name: string; description: string } | null>(null)
  const [editLesson, setEditLesson] = useState<{ id: string; name: string; content: string } | null>(null)

  // 1. Add a new state for track-level lessons
  const [addTrackLesson, setAddTrackLesson] = useState<{ [trackId: string]: { name: string; content: string } }>({})
  const [editTrackLesson, setEditTrackLesson] = useState<{ id: string; name: string; content: string } | null>(null)

  // 1. Add a new state for course-level lessons
  const [addCourseLesson, setAddCourseLesson] = useState<{ [courseId: string]: { name: string; content: string } }>({})
  const [editCourseLesson, setEditCourseLesson] = useState<{ id: string; name: string; content: string } | null>(null)

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    setError("")
    // Fetch all tracks, courses, modules, lessons
    const { data: tracks } = await supabase.from('tracks').select('*')
    const { data: courses } = await supabase.from('courses').select('*')
    const { data: modules } = await supabase.from('modules').select('*')
    const { data: lessons } = await supabase.from('lessons').select('*')
    // Separate track-level lessons (no module_id, but has track_id)
    const trackLessons = (lessons || []).filter((l: any) => l.track_id && !l.module_id)
    // Separate course-level lessons (no module_id, no track_id, but has course_id)
    const courseLessons = (lessons || []).filter((l: any) => l.course_id && !l.module_id && !l.track_id)
    // Nest data
    const nested = (tracks || []).map((track: any) => ({
      ...track,
      courses: (courses || []).filter((c: any) => c.track_id === track.id).map((course: any) => ({
        ...course,
        modules: (modules || []).filter((m: any) => m.course_id === course.id).map((module: any) => ({
          ...module,
          lessons: (lessons || []).filter((l: any) => l.module_id === module.id)
        })),
        courseLessons: courseLessons.filter((l: any) => l.course_id === course.id)
      })),
      trackLessons: trackLessons.filter((l: any) => l.track_id === track.id)
    }))
    setTracks(nested)
    setLoading(false)
  }

  // --- Track CRUD ---
  async function handleAddTrack(e: any) {
    e.preventDefault()
    if (!addTrack.name) return
    const { error } = await supabase.from("tracks").insert({ name: addTrack.name, description: addTrack.description })
    if (error) setError(error.message)
    setAddTrack({ name: "", description: "" })
    fetchAll()
  }
  function startEditTrack(track: Track) {
    setEditTrack({ id: track.id, name: track.name, description: track.description })
  }
  async function handleEditTrack(e: any) {
    e.preventDefault()
    if (!editTrack) return
    const { error } = await supabase.from("tracks").update({ name: editTrack.name, description: editTrack.description }).eq("id", editTrack.id)
    if (error) setError(error.message)
    setEditTrack(null)
    fetchAll()
  }
  async function handleDeleteTrack(id: string) {
    if (!confirm("Delete this track and all its data?")) return
    await supabase.from("tracks").delete().eq("id", id)
    fetchAll()
  }

  // --- Course CRUD ---
  async function handleAddCourse(e: any, trackId: string) {
    e.preventDefault()
    const { name, description } = addCourse[trackId] || {}
    if (!name) return
    const { error } = await supabase.from("courses").insert({ name, description, track_id: trackId })
    if (error) setError(error.message)
    setAddCourse({ ...addCourse, [trackId]: { name: "", description: "" } })
    fetchAll()
  }
  function startEditCourse(course: Course) {
    setEditCourse({ id: course.id, name: course.name, description: course.description })
  }
  async function handleEditCourse(e: any) {
    e.preventDefault()
    if (!editCourse) return
    const { error } = await supabase.from("courses").update({ name: editCourse.name, description: editCourse.description }).eq("id", editCourse.id)
    if (error) setError(error.message)
    setEditCourse(null)
    fetchAll()
  }
  async function handleDeleteCourse(id: string) {
    if (!confirm("Delete this course and all its data?")) return
    await supabase.from("courses").delete().eq("id", id)
    fetchAll()
  }

  // --- Module CRUD ---
  async function handleAddModule(e: any, courseId: string) {
    e.preventDefault()
    const { name, description } = addModule[courseId] || {}
    if (!name) return
    const { error } = await supabase.from("modules").insert({ name, description, course_id: courseId })
    if (error) setError(error.message)
    setAddModule({ ...addModule, [courseId]: { name: "", description: "" } })
    fetchAll()
  }
  function startEditModule(module: Module) {
    setEditModule({ id: module.id, name: module.name, description: module.description })
  }
  async function handleEditModule(e: any) {
    e.preventDefault()
    if (!editModule) return
    const { error } = await supabase.from("modules").update({ name: editModule.name, description: editModule.description }).eq("id", editModule.id)
    if (error) setError(error.message)
    setEditModule(null)
    fetchAll()
  }
  async function handleDeleteModule(id: string) {
    if (!confirm("Delete this module and all its data?")) return
    await supabase.from("modules").delete().eq("id", id)
    fetchAll()
  }

  // --- Lesson CRUD ---
  async function handleAddLesson(e: any, moduleId: string) {
    e.preventDefault()
    const { name, content } = addLesson[moduleId] || {}
    if (!name) return
    const { error } = await supabase.from("lessons").insert({ name, content, module_id: moduleId })
    if (error) setError(error.message)
    setAddLesson({ ...addLesson, [moduleId]: { name: "", content: "" } })
    fetchAll()
  }
  function startEditLesson(lesson: Lesson) {
    setEditLesson({ id: lesson.id, name: lesson.name, content: lesson.content })
  }
  async function handleEditLesson(e: any) {
    e.preventDefault()
    if (!editLesson) return
    const { error } = await supabase.from("lessons").update({ name: editLesson.name, content: editLesson.content }).eq("id", editLesson.id)
    if (error) setError(error.message)
    setEditLesson(null)
    fetchAll()
  }
  async function handleDeleteLesson(id: string) {
    if (!confirm("Delete this lesson?")) return
    await supabase.from("lessons").delete().eq("id", id)
    fetchAll()
  }

  // 2. Add Track-level Lesson CRUD handlers
  async function handleAddTrackLesson(e: any, trackId: string) {
    e.preventDefault()
    const { name, content } = addTrackLesson[trackId] || {}
    if (!name) return
    const { error } = await supabase.from("lessons").insert({ name, content, track_id: trackId })
    if (error) setError(error.message)
    setAddTrackLesson({ ...addTrackLesson, [trackId]: { name: "", content: "" } })
    fetchAll()
  }
  function startEditTrackLesson(lesson: any) {
    setEditTrackLesson({ id: lesson.id, name: lesson.name, content: lesson.content })
  }
  async function handleEditTrackLesson(e: any) {
    e.preventDefault()
    if (!editTrackLesson) return
    const { error } = await supabase.from("lessons").update({ name: editTrackLesson.name, content: editTrackLesson.content }).eq("id", editTrackLesson.id)
    if (error) setError(error.message)
    setEditTrackLesson(null)
    fetchAll()
  }
  async function handleDeleteTrackLesson(id: string) {
    if (!confirm("Delete this lesson?")) return
    await supabase.from("lessons").delete().eq("id", id)
    fetchAll()
  }

  // 2. Add Course-level Lesson CRUD handlers
  async function handleAddCourseLesson(e: any, courseId: string) {
    e.preventDefault()
    const { name, content } = addCourseLesson[courseId] || {}
    if (!name) return
    const { error } = await supabase.from("lessons").insert({ name, content, course_id: courseId })
    if (error) setError(error.message)
    setAddCourseLesson({ ...addCourseLesson, [courseId]: { name: "", content: "" } })
    fetchAll()
  }
  function startEditCourseLesson(lesson: any) {
    setEditCourseLesson({ id: lesson.id, name: lesson.name, content: lesson.content })
  }
  async function handleEditCourseLesson(e: any) {
    e.preventDefault()
    if (!editCourseLesson) return
    const { error } = await supabase.from("lessons").update({ name: editCourseLesson.name, content: editCourseLesson.content }).eq("id", editCourseLesson.id)
    if (error) setError(error.message)
    setEditCourseLesson(null)
    fetchAll()
  }
  async function handleDeleteCourseLesson(id: string) {
    if (!confirm("Delete this lesson?")) return
    await supabase.from("lessons").delete().eq("id", id)
    fetchAll()
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">লার্নিং পাথ ম্যানেজ করুন</h1>
      <p className="mb-6 text-gray-400 text-center">এখান থেকে আপনি লার্নিং পাথের সব ডাটা ম্যানেজ করতে পারবেন।</p>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="space-y-8">
        {/* Track CRUD */}
        <div className="bg-gray-900 rounded-xl p-6 border border-purple-700">
          <h2 className="text-xl font-semibold text-purple-400 mb-4">Tracks</h2>
          {/* Add Track Form */}
          <form onSubmit={handleAddTrack} className="flex flex-col md:flex-row gap-2 mb-6">
            <input type="text" placeholder="Track Name" value={addTrack.name} onChange={e => setAddTrack({ ...addTrack, name: e.target.value })} className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" required />
            <input type="text" placeholder="Description" value={addTrack.description} onChange={e => setAddTrack({ ...addTrack, description: e.target.value })} className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" />
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Add</button>
          </form>
          {/* Track List */}
          <div className="space-y-4">
            {loading ? <div className="text-gray-400">লোড হচ্ছে...</div> : tracks.length === 0 ? <div className="text-gray-400">No tracks found.</div> : tracks.map(track => (
              <div key={track.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  {editTrack && editTrack.id === track.id ? (
                    <form onSubmit={handleEditTrack} className="flex flex-col md:flex-row gap-2 w-full">
                      <input type="text" value={editTrack.name} onChange={e => setEditTrack({ ...editTrack, name: e.target.value })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" required />
                      <input type="text" value={editTrack.description} onChange={e => setEditTrack({ ...editTrack, description: e.target.value })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" />
                      <button type="submit" className="text-green-400">Save</button>
                      <button type="button" onClick={() => setEditTrack(null)} className="text-gray-400">Cancel</button>
                    </form>
                  ) : (
                    <>
                      <div>
                        <span className="font-semibold text-purple-300 text-lg">{track.name}</span>
                        <span className="ml-2 text-gray-400">{track.description}</span>
                      </div>
                      <div>
                        <button onClick={() => startEditTrack(track)} className="text-blue-400 mr-2">Edit</button>
                        <button onClick={() => handleDeleteTrack(track.id)} className="text-red-400">Delete</button>
                      </div>
                    </>
                  )}
                </div>
                {/* Track-level Lessons CRUD */}
                <div className="bg-gray-900 rounded p-3 mb-4">
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">Lessons (for this Track)</h3>
                  {/* Add Track Lesson Form */}
                  <form onSubmit={e => handleAddTrackLesson(e, track.id)} className="flex flex-col md:flex-row gap-2 mb-3">
                    <input type="text" placeholder="Lesson Name" value={addTrackLesson[track.id]?.name || ""} onChange={e => setAddTrackLesson({ ...addTrackLesson, [track.id]: { ...addTrackLesson[track.id], name: e.target.value } })} className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" required />
                    <input type="text" placeholder="Content (optional)" value={addTrackLesson[track.id]?.content || ""} onChange={e => setAddTrackLesson({ ...addTrackLesson, [track.id]: { ...addTrackLesson[track.id], content: e.target.value } })} className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" />
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded">Add Lesson</button>
                  </form>
                  {/* Track Lesson List */}
                  {track.trackLessons && track.trackLessons.length === 0 ? <div className="text-gray-500 mb-2">No lessons for this track.</div> : (
                    <ul className="ml-2">
                      {track.trackLessons && track.trackLessons.map((lesson: any) => (
                        <li key={lesson.id} className="flex items-center justify-between py-1">
                          {editTrackLesson && editTrackLesson.id === lesson.id ? (
                            <form onSubmit={handleEditTrackLesson} className="flex flex-col md:flex-row gap-2 w-full">
                              <input type="text" value={editTrackLesson.name} onChange={e => setEditTrackLesson({ ...editTrackLesson, name: e.target.value })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" required />
                              <input type="text" value={editTrackLesson.content} onChange={e => setEditTrackLesson({ ...editTrackLesson, content: e.target.value })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" />
                              <button type="submit" className="text-green-400">Save</button>
                              <button type="button" onClick={() => setEditTrackLesson(null)} className="text-gray-400">Cancel</button>
                            </form>
                          ) : (
                            <>
                              <span className="text-gray-200">{lesson.name}</span>
                              <div>
                                <button onClick={() => startEditTrackLesson(lesson)} className="text-blue-400 mr-2">Edit</button>
                                <button onClick={() => handleDeleteTrackLesson(lesson.id)} className="text-red-400">Delete</button>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Always show courses for every track */}
                <div className="mt-4 ml-4">
                  {/* Add Course Form */}
                  <form onSubmit={e => handleAddCourse(e, track.id)} className="flex flex-col md:flex-row gap-2 mb-4">
                    <input type="text" placeholder="Course Name" value={addCourse[track.id]?.name || ""} onChange={e => setAddCourse({ ...addCourse, [track.id]: { ...addCourse[track.id], name: e.target.value } })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" required />
                    <input type="text" placeholder="Description" value={addCourse[track.id]?.description || ""} onChange={e => setAddCourse({ ...addCourse, [track.id]: { ...addCourse[track.id], description: e.target.value } })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Add Course</button>
                  </form>
                  {/* Course List */}
                  {track.courses.length === 0 ? <div className="text-gray-500 mb-2">No courses.</div> : track.courses.map(course => (
                    <div key={course.id} className="bg-gray-900 rounded p-3 mb-2">
                      <div className="flex items-center justify-between">
                        {editCourse && editCourse.id === course.id ? (
                          <form onSubmit={handleEditCourse} className="flex flex-col md:flex-row gap-2 w-full">
                            <input type="text" value={editCourse.name} onChange={e => setEditCourse({ ...editCourse, name: e.target.value })} className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" required />
                            <input type="text" value={editCourse.description} onChange={e => setEditCourse({ ...editCourse, description: e.target.value })} className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" />
                            <button type="submit" className="text-green-400">Save</button>
                            <button type="button" onClick={() => setEditCourse(null)} className="text-gray-400">Cancel</button>
                          </form>
                        ) : (
                          <>
                            <div>
                              <span className="font-semibold text-blue-300">{course.name}</span>
                              <span className="ml-2 text-gray-400">{course.description}</span>
                            </div>
                            <div>
                              <button onClick={() => startEditCourse(course)} className="text-blue-400 mr-2">Edit</button>
                              <button onClick={() => handleDeleteCourse(course.id)} className="text-red-400">Delete</button>
                            </div>
                          </>
                        )}
                      </div>
                      {/* Always show modules for every course */}
                      <div className="mt-3 ml-4">
                        {/* Add Module Form */}
                        <form onSubmit={e => handleAddModule(e, course.id)} className="flex flex-col md:flex-row gap-2 mb-3">
                          <input type="text" placeholder="Module Name" value={addModule[course.id]?.name || ""} onChange={e => setAddModule({ ...addModule, [course.id]: { ...addModule[course.id], name: e.target.value } })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" required />
                          <input type="text" placeholder="Description" value={addModule[course.id]?.description || ""} onChange={e => setAddModule({ ...addModule, [course.id]: { ...addModule[course.id], description: e.target.value } })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" />
                          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">Add Module</button>
                        </form>
                        {/* Course-level Lessons CRUD */}
                        <div className="bg-gray-900 rounded p-3 mb-3">
                          <h4 className="text-md font-semibold text-blue-300 mb-2">Lessons (for this Course)</h4>
                          {/* Add Course Lesson Form */}
                          <form onSubmit={e => handleAddCourseLesson(e, course.id)} className="flex flex-col md:flex-row gap-2 mb-2">
                            <input type="text" placeholder="Lesson Name" value={addCourseLesson[course.id]?.name || ""} onChange={e => setAddCourseLesson({ ...addCourseLesson, [course.id]: { ...addCourseLesson[course.id], name: e.target.value } })} className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" required />
                            <input type="text" placeholder="Content (optional)" value={addCourseLesson[course.id]?.content || ""} onChange={e => setAddCourseLesson({ ...addCourseLesson, [course.id]: { ...addCourseLesson[course.id], content: e.target.value } })} className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" />
                            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded">Add Lesson</button>
                          </form>
                          {/* Course Lesson List */}
                          {course.courseLessons && course.courseLessons.length === 0 ? <div className="text-gray-500 mb-2">No lessons for this course.</div> : (
                            <ul className="ml-2">
                              {course.courseLessons && course.courseLessons.map((lesson: any) => (
                                <li key={lesson.id} className="flex items-center justify-between py-1">
                                  {editCourseLesson && editCourseLesson.id === lesson.id ? (
                                    <form onSubmit={handleEditCourseLesson} className="flex flex-col md:flex-row gap-2 w-full">
                                      <input type="text" value={editCourseLesson.name} onChange={e => setEditCourseLesson({ ...editCourseLesson, name: e.target.value })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" required />
                                      <input type="text" value={editCourseLesson.content} onChange={e => setEditCourseLesson({ ...editCourseLesson, content: e.target.value })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" />
                                      <button type="submit" className="text-green-400">Save</button>
                                      <button type="button" onClick={() => setEditCourseLesson(null)} className="text-gray-400">Cancel</button>
                                    </form>
                                  ) : (
                                    <>
                                      <span className="text-gray-200">{lesson.name}</span>
                                      <div>
                                        <button onClick={() => startEditCourseLesson(lesson)} className="text-blue-400 mr-2">Edit</button>
                                        <button onClick={() => handleDeleteCourseLesson(lesson.id)} className="text-red-400">Delete</button>
                                      </div>
                                    </>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        {/* Module List */}
                        {course.modules.length === 0 ? <div className="text-gray-500 mb-2">No modules.</div> : course.modules.map(module => (
                          <div key={module.id} className="bg-gray-800 rounded p-3 mb-2">
                            <div className="flex items-center justify-between">
                              {editModule && editModule.id === module.id ? (
                                <form onSubmit={handleEditModule} className="flex flex-col md:flex-row gap-2 w-full">
                                  <input type="text" value={editModule.name} onChange={e => setEditModule({ ...editModule, name: e.target.value })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" required />
                                  <input type="text" value={editModule.description} onChange={e => setEditModule({ ...editModule, description: e.target.value })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" />
                                  <button type="submit" className="text-green-400">Save</button>
                                  <button type="button" onClick={() => setEditModule(null)} className="text-gray-400">Cancel</button>
                                </form>
                              ) : (
                                <>
                                  <div>
                                    <span className="font-semibold text-green-400">{module.name}</span>
                                    <span className="ml-2 text-gray-400">{module.description}</span>
                                  </div>
                                  <div>
                                    <button onClick={() => startEditModule(module)} className="text-blue-400 mr-2">Edit</button>
                                    <button onClick={() => handleDeleteModule(module.id)} className="text-red-400">Delete</button>
                                  </div>
                                </>
                              )}
                            </div>
                            {/* Always show lessons for every module */}
                            <div className="mt-3 ml-4">
                                {/* Add Lesson Form */}
                                <form onSubmit={e => handleAddLesson(e, module.id)} className="flex flex-col md:flex-row gap-2 mb-3">
                                  <input type="text" placeholder="Lesson Name" value={addLesson[module.id]?.name || ""} onChange={e => setAddLesson({ ...addLesson, [module.id]: { ...addLesson[module.id], name: e.target.value } })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" required />
                                  <input type="text" placeholder="Content (optional)" value={addLesson[module.id]?.content || ""} onChange={e => setAddLesson({ ...addLesson, [module.id]: { ...addLesson[module.id], content: e.target.value } })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" />
                                  <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded">Add Lesson</button>
                                </form>
                                {/* Lesson List */}
                                {module.lessons.length === 0 ? <div className="text-gray-500 mb-2">No lessons.</div> : (
                                  <ul className="ml-2">
                                    {module.lessons.map(lesson => (
                                      <li key={lesson.id} className="flex items-center justify-between py-1">
                                        {editLesson && editLesson.id === lesson.id ? (
                                          <form onSubmit={handleEditLesson} className="flex flex-col md:flex-row gap-2 w-full">
                                            <input type="text" value={editLesson.name} onChange={e => setEditLesson({ ...editLesson, name: e.target.value })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" required />
                                            <input type="text" value={editLesson.content} onChange={e => setEditLesson({ ...editLesson, content: e.target.value })} className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none" />
                                            <button type="submit" className="text-green-400">Save</button>
                                            <button type="button" onClick={() => setEditLesson(null)} className="text-gray-400">Cancel</button>
                                          </form>
                                        ) : (
                                          <>
                                            <span className="text-gray-200">{lesson.name}</span>
                                            <div>
                                              <button onClick={() => startEditLesson(lesson)} className="text-blue-400 mr-2">Edit</button>
                                              <button onClick={() => handleDeleteLesson(lesson.id)} className="text-red-400">Delete</button>
                                            </div>
                                          </>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 