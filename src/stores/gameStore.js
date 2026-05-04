import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

import chaptersData from '../data/chapters.json'
import lessonsData from '../data/lessons.json'
import exercisesData from '../data/exercises.json'

export const useGameStore = defineStore('game', () => {
  // ── Data ──
  const chapters = ref(chaptersData)
  const lessons = ref(lessonsData)
  const exercises = ref(exercisesData)

  // ── Progress ──
  const progress = ref({}) // key: lessonId -> { completed, score, exercises: { exId: {attempts,score} } }

  // ── Current session state ──
  const currentChapterId = ref(null)
  const currentLessonId = ref(null)
  const currentExerciseIndex = ref(0)

  // ── Getters ──

  /** Lessons for a given chapter, sorted by order */
  const lessonsForChapter = computed(() => (chapterId) => {
    return lessons.value
      .filter(l => l.chapterId === chapterId)
      .sort((a, b) => a.order - b.order)
  })

  /** Exercises for a given lesson, sorted by their order in the lesson */
  const exercisesForLesson = computed(() => (lessonId) => {
    const lesson = lessons.value.find(l => l.id === lessonId)
    if (!lesson) return []
    return lesson.exerciseIds
      .map(id => exercises.value.find(e => e.id === id))
      .filter(Boolean)
  })

  /** Current exercise object */
  const currentExercise = computed(() => {
    const lesson = lessons.value.find(l => l.id === currentLessonId.value)
    if (!lesson) return null
    const exId = lesson.exerciseIds[currentExerciseIndex.value]
    return exercises.value.find(e => e.id === exId) || null
  })

  /** Is a lesson unlocked? */
  const isLessonUnlocked = computed(() => (lessonId) => {
    const lesson = lessons.value.find(l => l.id === lessonId)
    if (!lesson) return false

    // First lesson of first chapter always unlocked
    const firstChapter = chapters.value.sort((a, b) => a.order - b.order)[0]
    const firstLessonOfFirstChapter = lessons.value
      .filter(l => l.chapterId === firstChapter?.id)
      .sort((a, b) => a.order - b.order)[0]
    if (lesson.id === firstLessonOfFirstChapter?.id) return true

    // Check previous lesson in same chapter
    const chapterLessons = lessons.value
      .filter(l => l.chapterId === lesson.chapterId)
      .sort((a, b) => a.order - b.order)
    const idx = chapterLessons.findIndex(l => l.id === lessonId)
    if (idx > 0) {
      const prev = chapterLessons[idx - 1]
      if (progress.value[prev.id]?.completed) return true
      return false
    }

    // First lesson of next chapter: check if all previous chapter lessons complete
    if (idx === 0) {
      const sortedChapters = chapters.value.sort((a, b) => a.order - b.order)
      const chapIdx = sortedChapters.findIndex(c => c.id === lesson.chapterId)
      if (chapIdx > 0) {
        const prevChapter = sortedChapters[chapIdx - 1]
        const prevChapterLessons = lessons.value
          .filter(l => l.chapterId === prevChapter.id)
        return prevChapterLessons.every(l => progress.value[l.id]?.completed)
      }
    }

    return false
  })

  /** Chapter completion progress (0-1) */
  const chapterProgress = computed(() => (chapterId) => {
    const chapterLessons = lessons.value
      .filter(l => l.chapterId === chapterId)
    if (chapterLessons.length === 0) return 0
    const completed = chapterLessons.filter(l => progress.value[l.id]?.completed).length
    return completed / chapterLessons.length
  })

  /** Overall progress (0-1) */
  const overallProgress = computed(() => {
    const allLessons = lessons.value
    if (allLessons.length === 0) return 0
    const completed = allLessons.filter(l => progress.value[l.id]?.completed).length
    return completed / allLessons.length
  })

  // ── Actions ──

  function setCurrentChapter (chapterId) {
    currentChapterId.value = chapterId
  }

  function setCurrentLesson (lessonId) {
    currentLessonId.value = lessonId
    currentExerciseIndex.value = 0
  }

  function nextExercise () {
    const lesson = lessons.value.find(l => l.id === currentLessonId.value)
    if (!lesson) return false
    if (currentExerciseIndex.value < lesson.exerciseIds.length - 1) {
      currentExerciseIndex.value++
      return true
    }
    return false
  }

  /**
   * Record exercise attempt & check if lesson complete
   */
  function completeExercise (exerciseId, score) {
    const lesson = lessons.value.find(l => l.id === currentLessonId.value)
    if (!lesson) return false

    // Init lesson progress
    if (!progress.value[lesson.id]) {
      progress.value[lesson.id] = { completed: false, score: 0, exercises: {} }
    }

    // Track per-exercise
    progress.value[lesson.id].exercises[exerciseId] = {
      attempts: (progress.value[lesson.id].exercises[exerciseId]?.attempts || 0) + 1,
      score
    }

    // Check if all exercises in lesson done
    const allDone = lesson.exerciseIds.every(
      id => progress.value[lesson.id].exercises[id]?.attempts > 0
    )
    if (allDone) {
      const totalScore = Object.values(progress.value[lesson.id].exercises).reduce(
        (sum, ex) => sum + ex.score, 0
      )
      progress.value[lesson.id].completed = true
      progress.value[lesson.id].score = Math.round(totalScore / lesson.exerciseIds.length)
    }

    return allDone
  }

  function resetLessonProgress (lessonId) {
    delete progress.value[lessonId]
    if (currentLessonId.value === lessonId) {
      currentExerciseIndex.value = 0
    }
  }

  function loadProgress () {
    try {
      const saved = localStorage.getItem('aprendealeer_progress')
      if (saved) {
        progress.value = JSON.parse(saved)
      }
    } catch (e) {
      // ignore corrupt data
    }
  }

  function saveProgress () {
    try {
      localStorage.setItem('aprendealeer_progress', JSON.stringify(progress.value))
    } catch (e) {
      // localStorage full or unavailable
    }
  }

  // Watch progress changes → auto-save
  watch(progress, saveProgress, { deep: true })

  return {
    // state
    chapters,
    lessons,
    exercises,
    progress,
    currentChapterId,
    currentLessonId,
    currentExerciseIndex,
    // getters
    lessonsForChapter,
    exercisesForLesson,
    currentExercise,
    isLessonUnlocked,
    chapterProgress,
    overallProgress,
    // actions
    setCurrentChapter,
    setCurrentLesson,
    nextExercise,
    completeExercise,
    resetLessonProgress,
    loadProgress,
    saveProgress
  }
})
