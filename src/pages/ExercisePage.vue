<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row justify-center">
      <div class="col-12 col-sm-8 col-md-6" style="max-width: 520px;">

        <!-- ── Lesson complete screen ── -->
        <template v-if="lessonComplete">
          <q-card class="complete-card text-center q-pa-xl">
            <q-card-section>
              <div class="complete-icon q-mb-md">🎉</div>
              <div class="text-h4 text-weight-black text-primary q-mb-sm">
                ¡Lección completa!
              </div>
              <p class="text-grey-7 text-body1 q-mb-lg">
                {{ lessonTitle }}
              </p>

              <!-- Stars -->
              <div class="row justify-center q-gutter-sm q-mb-lg">
                <q-icon
                  v-for="n in 3" :key="n"
                  :name="n <= starsEarned ? 'star' : 'star_border'"
                  :color="n <= starsEarned ? 'warning' : 'grey-4'"
                  size="48px"
                  class="star-anim"
                  :style="{ animationDelay: `${n * 0.2}s` }"
                />
              </div>

              <div class="text-h6 text-grey-8 q-mb-lg">
                {{ starsEarned }}/3 estrellas
              </div>

              <q-btn
                color="primary"
                label="Siguiente lección"
                icon-right="arrow_forward"
                size="lg"
                class="q-mb-md full-width"
                :to="nextLessonRoute"
                rounded
                no-caps
                :disable="!nextLessonRoute"
              />
              <br />
              <q-btn
                flat
                color="grey-7"
                label="Repetir lección"
                icon="replay"
                @click="repeatLesson"
                no-caps
              />
            </q-card-section>
          </q-card>
        </template>

        <!-- ── Exercise player ── -->
        <template v-else-if="exercise">
          <!-- Header: lesson title + progress dots -->
          <div class="q-mb-md">
            <div class="text-overline text-grey-5 q-mb-xs">
              {{ lessonTitle }}
            </div>
            <div class="row items-center q-gutter-xs">
              <div
                v-for="(exId, idx) in lessonExerciseIds"
                :key="exId"
                class="progress-dot"
                :class="{
                  'dot-done': idx < currentExIndex,
                  'dot-current': idx === currentExIndex,
                  'dot-pending': idx > currentExIndex
                }"
              />
            </div>
          </div>

          <!-- Exercise card -->
          <q-card class="exercise-card q-pa-lg">
            <!-- Instructions -->
            <q-card-section class="text-center q-pt-none">
              <div class="exercise-type-badge q-mb-sm">
                <q-chip
                  :color="isSyllable ? 'cyan' : 'secondary'"
                  text-color="white"
                  size="sm"
                  class="text-weight-bold"
                >
                  <q-icon :name="isSyllable ? 'puzzle' : 'text_fields'" size="sm" class="q-mr-xs" />
                  {{ isSyllable ? 'Sílabas' : 'Palabras' }}
                </q-chip>
              </div>
              <div class="text-h6 text-weight-bold q-mb-md">
                {{ exercise.instructions }}
              </div>
            </q-card-section>

            <!-- Drop zones -->
            <q-card-section class="q-py-md">
              <div class="drop-zones row justify-center q-gutter-sm q-mb-lg">
                <div
                  v-for="(slot, idx) in dnd.slots.value"
                  :key="'slot-' + idx"
                  class="drop-zone"
                  :class="{
                    'drop-hover': dnd.hoveredSlot.value === idx,
                    'drop-filled': slot !== null,
                    'drop-selected': dnd.selectedWord.value === slot,
                    'drop-correct': dnd.dragFeedback.value === 'correct',
                    'drop-incorrect': dnd.dragFeedback.value === 'incorrect'
                  }"
                  @dragover="dnd.onDragOver($event, idx)"
                  @dragleave="dnd.onDragLeave()"
                  @drop="dnd.onDrop($event, idx)"
                  @click="dnd.onSlotTap(idx)"
                  @touchend.prevent="dnd.onSlotTap(idx)"
                >
                  <transition name="bounce" mode="out-in">
                    <span v-if="slot" :key="slot" class="slot-word">
                      {{ slot }}
                    </span>
                    <span v-else :key="'empty'" class="slot-placeholder text-grey-4">
                      ?
                    </span>
                  </transition>
                </div>
              </div>
            </q-card-section>

            <!-- Feedback banner -->
            <transition name="slide-fade">
              <div
                v-if="dnd.dragFeedback.value === 'correct'"
                class="feedback-banner bg-positive text-white text-center q-mb-md"
              >
                <q-icon name="check_circle" size="20px" class="q-mr-xs" />
                ¡Correcto!
              </div>
              <div
                v-else-if="dnd.dragFeedback.value === 'incorrect'"
                class="feedback-banner bg-negative text-white text-center q-mb-md shake"
              >
                <q-icon name="error" size="20px" class="q-mr-xs" />
                Intenta de nuevo
              </div>
            </transition>

            <!-- Word bank (draggable chips) -->
            <q-card-section class="q-pt-none">
              <div class="text-caption text-grey-5 q-mb-sm">
                {{ isSyllable ? 'Toca y arrastra las sílabas' : 'Toca y arrastra las palabras' }}
              </div>
              <div class="word-bank row justify-center q-gutter-sm">
                <q-chip
                  v-for="word in dnd.bank.value"
                  :key="word"
                  :draggable="!dnd.submitted.value"
                  :class="{
                    'word-chip': true,
                    'chip-selected': dnd.selectedWord.value === word,
                    'chip-dragging': dnd.draggedWord.value === word
                  }"
                  :color="isSyllable ? 'cyan' : 'orange'"
                  text-color="white"
                  size="xl"
                  clickable
                  @dragstart="dnd.onDragStart($event, word)"
                  @dragend="dnd.onDragEnd()"
                  @click="dnd.onWordTap(word)"
                  @touchend.prevent="dnd.onWordTap(word)"
                >
                  <span class="chip-label">{{ word }}</span>
                </q-chip>
              </div>

              <!-- Empty bank hint -->
              <div
                v-if="dnd.bank.value.length === 0 && dnd.dragFeedback.value === ''"
                class="text-center text-grey-4 q-mt-md text-caption"
              >
                ✓ Todas las palabras colocadas
              </div>
            </q-card-section>

            <!-- Actions -->
            <q-separator class="q-mb-md" />

            <q-card-actions align="between" class="q-px-none q-py-sm">
              <q-btn
                flat
                color="grey-6"
                label="Salir"
                icon="exit_to_app"
                @click="goBack"
                no-caps
                size="md"
              />
              <q-btn
                v-if="!dnd.submitted.value"
                color="primary"
                label="Comprobar"
                :disable="!dnd.allSlotsFilled.value"
                @click="checkAnswer"
                rounded
                no-caps
                size="md"
              />
              <q-btn
                v-else-if="dnd.dragFeedback.value === 'correct'"
                color="primary"
                :label="isLastExercise ? 'Ver resultado' : 'Siguiente'"
                icon-right="arrow_forward"
                @click="nextOrComplete"
                rounded
                no-caps
                size="md"
              />
              <q-btn
                v-else
                color="warning"
                label="Reintentar"
                icon="replay"
                @click="retry"
                rounded
                no-caps
                size="md"
              />
            </q-card-actions>
          </q-card>
        </template>

        <!-- ── Error state ── -->
        <div v-else class="text-center q-mt-xl">
          <q-icon name="error_outline" size="64px" color="grey-4" />
          <p class="text-grey-6 text-h6 q-mt-sm">Ejercicio no encontrado</p>
          <q-btn flat color="primary" label="Volver" @click="goBack" no-caps />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from 'stores/gameStore'
import { useDragAndDrop } from 'src/composables/useDragAndDrop'

const props = defineProps({
  lessonId: { type: String, required: true },
  exerciseId: { type: String, required: true }
})

const route = useRoute()
const router = useRouter()
const store = useGameStore()

// ── Exercise data ──

const exercise = computed(() => {
  return store.exercises.find(e => e.id === props.exerciseId) || null
})

const lessonTitle = computed(() => {
  const l = store.lessons.find(l => l.id === props.lessonId)
  return l ? l.title : ''
})

const lessonExerciseIds = computed(() => {
  const l = store.lessons.find(l => l.id === props.lessonId)
  return l ? l.exerciseIds : []
})

const currentExIndex = computed(() => {
  return lessonExerciseIds.value.indexOf(props.exerciseId)
})

const isLastExercise = computed(() => {
  return currentExIndex.value >= lessonExerciseIds.value.length - 1
})

const isSyllable = computed(() => exercise.value?.config?.isSyllable === true)

// ── Drag & Drop composable ──

const dnd = useDragAndDrop(exercise)

// ── Exercise state ──

const lessonComplete = ref(false)
const starsEarned = ref(0)

// ── Next lesson route ──

const nextLessonRoute = computed(() => {
  const lessons = store.lessonsForChapter(store.currentChapterId)
  const currentIdx = lessons.findIndex(l => l.id === props.lessonId)
  const next = lessons[currentIdx + 1]
  if (next) {
    return { name: 'exercise', params: { lessonId: next.id, exerciseId: next.exerciseIds[0] } }
  }
  return null
})

// ── Methods ──

function checkAnswer () {
  const result = dnd.submit()
  if (result.correct) {
    store.completeExercise(props.exerciseId, result.score)
  }
}

function retry () {
  dnd.reset()
}

function nextOrComplete () {
  if (isLastExercise.value) {
    // Show lesson complete
    const lessonProgress = store.progress[props.lessonId]
    starsEarned.value = lessonProgress?.score ? Math.ceil(lessonProgress.score / 2) : 1
    lessonComplete.value = true
  } else {
    // Navigate to next exercise
    const nextExId = lessonExerciseIds.value[currentExIndex.value + 1]
    router.push({
      name: 'exercise',
      params: { lessonId: props.lessonId, exerciseId: nextExId }
    })
  }
}

function repeatLesson () {
  lessonComplete.value = false
  store.resetLessonProgress(props.lessonId)
  store.setCurrentLesson(props.lessonId)
  const firstExId = lessonExerciseIds.value[0]
  router.replace({
    name: 'exercise',
    params: { lessonId: props.lessonId, exerciseId: firstExId }
  })
}

function goBack () {
  const chapter = store.chapters.find(c =>
    store.lessons.some(l => l.id === props.lessonId && l.chapterId === c.id)
  )
  if (chapter) {
    router.push({ name: 'lessons', params: { chapterId: chapter.id } })
  } else {
    router.push({ name: 'chapters' })
  }
}

// ── Lifecycle ──

onMounted(() => {
  store.setCurrentLesson(props.lessonId)
  const chapter = store.chapters.find(c =>
    store.lessons.some(l => l.id === props.lessonId && l.chapterId === c.id)
  )
  if (chapter) store.setCurrentChapter(chapter.id)
  dnd.init()
})

// Re-init when exercise changes (route params update within same page)
watch(() => props.exerciseId, () => {
  lessonComplete.value = false
  dnd.init()
})
</script>

<style scoped>
/* ── Progress dots ── */
.progress-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transition: all 0.3s ease;
}
.dot-done { background: var(--q-primary); }
.dot-current {
  background: var(--q-secondary);
  box-shadow: 0 0 0 4px rgba(255, 152, 0, 0.3);
  transform: scale(1.3);
}
.dot-pending { background: #e0e0e0; }

/* ── Exercise card ── */
.exercise-card {
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

/* ── Drop zones ── */
.drop-zones {
  min-height: 60px;
}
.drop-zone {
  width: 90px;
  height: 56px;
  border: 2.5px dashed #ccc;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: #fafafa;
}
.drop-zone.drop-hover {
  border-color: var(--q-secondary);
  background: rgba(255, 152, 0, 0.08);
  transform: scale(1.05);
}
.drop-zone.drop-filled {
  border-style: solid;
  border-color: var(--q-primary);
  background: #f1f8e9;
}
.drop-zone.drop-selected {
  border-color: var(--q-accent);
  box-shadow: 0 0 0 3px rgba(156, 39, 176, 0.2);
}
.drop-zone.drop-correct {
  border-color: var(--q-primary);
  background: #e8f5e9;
}
.drop-zone.drop-incorrect {
  border-color: var(--q-negative);
  background: #ffebee;
  animation: shake 0.4s ease;
}

.slot-word {
  font-weight: 700;
  font-size: 1.05rem;
  color: #333;
}
.slot-placeholder {
  font-weight: 700;
  font-size: 1.2rem;
}

/* ── Word bank chips ── */
.word-bank {
  min-height: 48px;
}
.word-chip {
  padding: 8px 18px;
  font-weight: 700;
  font-size: 1rem;
  cursor: grab;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
}
.word-chip:active { cursor: grabbing; }
.chip-selected {
  transform: scale(1.12);
  box-shadow: 0 4px 12px rgba(156, 39, 176, 0.35);
}
.chip-dragging {
  opacity: 0.5;
}
.chip-label {
  display: inline-block;
  padding: 2px 0;
}

/* ── Feedback banner ── */
.feedback-banner {
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
}

/* ── Lesson complete card ── */
.complete-card {
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
}
.complete-icon {
  font-size: 4rem;
  animation: bounce-in 0.5s ease;
}
.star-anim {
  animation: bounce-in 0.4s ease both;
}

/* ── Transitions ── */
.bounce-enter-active { animation: bounce-in 0.25s ease; }
.bounce-leave-active { animation: bounce-in 0.2s ease reverse; }

.slide-fade-enter-active { transition: all 0.3s ease; }
.slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateY(-10px); }
.slide-fade-leave-to { opacity: 0; transform: translateY(10px); }

/* ── Animations ── */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}

@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
</style>
