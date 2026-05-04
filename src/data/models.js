/**
 * @typedef {'dragAndDrop' | 'fixGrammar' | 'fixAccentuation' | 'syllableGame' | 'crossword'} ExerciseType
 *
 * @typedef {Object} Chapter
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} order
 * @property {string} icon
 *
 * @typedef {Object} Lesson
 * @property {string} id
 * @property {string} chapterId
 * @property {string} title
 * @property {number} order
 * @property {string[]} exerciseIds
 *
 * @typedef {Object} Exercise
 * @property {string} id
 * @property {string} lessonId
 * @property {ExerciseType} type
 * @property {string} instructions
 * @property {Object} config
 * @property {*} correctAnswer
 *
 * @typedef {Object} Progress
 * @property {string} exerciseId
 * @property {boolean} completed
 * @property {number} score
 * @property {number} attempts
 * @property {number} lastAttemptedAt
 */

export const ExerciseTypes = Object.freeze({
  DRAG_AND_DROP: 'dragAndDrop',
  FIX_GRAMMAR: 'fixGrammar',
  FIX_ACCENTUATION: 'fixAccentuation',
  SYLLABLE_GAME: 'syllableGame',
  CROSSWORD: 'crossword'
})
