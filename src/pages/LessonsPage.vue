<template>
  <q-page class="q-pa-md q-pt-lg">
    <div class="text-center q-mb-lg">
      <div class="text-overline text-grey-5 q-mb-xs">CAPÍTULO</div>
      <h2 class="text-h4 text-weight-black q-my-none text-primary">
        {{ chapterTitle }}
      </h2>
      <div class="text-caption text-grey-6 q-mt-sm">
        {{ completedCount }}/{{ chapterLessons.length }} lecciones
      </div>
      <q-linear-progress
        :value="chapterProgress"
        size="6px"
        color="primary"
        rounded
        class="q-mt-sm"
        style="max-width: 200px; margin: 0 auto;"
      />
    </div>

    <!-- Timeline lessons -->
    <div class="row justify-center">
      <div class="col-12 col-sm-8 col-md-6 col-lg-5">
        <div class="timeline">
          <div
            v-for="(lesson, idx) in chapterLessons"
            :key="lesson.id"
            class="timeline-item"
            :class="{
              'is-completed': isCompleted(lesson.id),
              'is-current': isCurrent(lesson.id),
              'is-locked': !isUnlocked(lesson.id),
              'clickable': isUnlocked(lesson.id)
            }"
            @click="openLesson(lesson.id)"
            tabindex="0"
            @keydown.enter="openLesson(lesson.id)"
          >
            <!-- Timeline connector -->
            <div class="timeline-dot" :style="{ animationDelay: `${idx * 0.06}s` }">
              <q-icon
                v-if="isCompleted(lesson.id)"
                name="check"
                size="16px"
                color="white"
              />
              <q-icon
                v-else-if="isUnlocked(lesson.id)"
                name="play_arrow"
                size="16px"
                color="white"
              />
              <q-icon
                v-else
                name="lock"
                size="14px"
                color="white"
              />
            </div>
            <div class="timeline-line" v-if="idx < chapterLessons.length - 1" />

            <!-- Content card -->
            <div class="timeline-content">
              <q-card
                flat
                bordered
                :class="{
                  'bg-green-1 border-primary': isCompleted(lesson.id),
                  'bg-white border-secondary': isCurrent(lesson.id) && !isCompleted(lesson.id),
                  'bg-grey-2 text-grey-5': !isUnlocked(lesson.id)
                }"
                class="lesson-card"
              >
                <q-card-section class="q-py-sm q-px-md row items-center no-wrap">
                  <div class="col">
                    <div class="text-weight-bold" :class="{ 'text-grey-5': !isUnlocked(lesson.id) }">
                      {{ lesson.title }}
                    </div>
                    <div class="text-caption" :class="{ 'text-grey-4': !isUnlocked(lesson.id), 'text-grey-7': isUnlocked(lesson.id) }">
                      Lección {{ idx + 1 }} · {{ lesson.exerciseIds.length }} ejercicio{{ lesson.exerciseIds.length !== 1 ? 's' : '' }}
                    </div>
                  </div>

                  <!-- Status badge -->
                  <div v-if="isCompleted(lesson.id)">
                    <q-badge outline color="primary" class="q-px-sm q-py-xs rounded-borders">
                      <q-icon name="check_circle" size="14px" class="q-mr-xs" />
                      Hecho
                    </q-badge>
                  </div>
                  <div v-else-if="isUnlocked(lesson.id)">
                    <q-icon name="chevron_right" color="secondary" size="24px" />
                  </div>
                  <div v-else>
                    <q-icon name="lock" color="grey-4" size="18px" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="chapterLessons.length === 0" class="text-center q-mt-xl">
          <q-icon name="info" size="48px" color="grey-4" />
          <p class="text-grey-5 q-mt-sm">No hay lecciones en este capítulo</p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from 'stores/gameStore'

const props = defineProps({
  chapterId: { type: String, required: true }
})

const router = useRouter()
const store = useGameStore()

const chapterLessons = computed(() => store.lessonsForChapter(props.chapterId))

const chapterTitle = computed(() => {
  const ch = store.chapters.find(c => c.id === props.chapterId)
  return ch ? ch.title : 'Capítulo'
})

const chapterProgress = computed(() => store.chapterProgress(props.chapterId))

const completedCount = computed(() => {
  return chapterLessons.value.filter(l => store.progress[l.id]?.completed).length
})

// First uncompleted unlocked lesson is "current"
const currentLessonId = computed(() => {
  return chapterLessons.value.find(l => store.isLessonUnlocked(l.id) && !store.progress[l.id]?.completed)?.id || null
})

function isUnlocked (lessonId) { return store.isLessonUnlocked(lessonId) }
function isCompleted (lessonId) { return !!store.progress[lessonId]?.completed }
function isCurrent (lessonId) { return lessonId === currentLessonId.value }

function openLesson (lessonId) {
  if (!isUnlocked(lessonId)) return
  store.setCurrentLesson(lessonId)
  store.setCurrentChapter(props.chapterId)
  const lesson = store.lessons.find(l => l.id === lessonId)
  if (lesson && lesson.exerciseIds.length > 0) {
    router.push({
      name: 'exercise',
      params: { lessonId, exerciseId: lesson.exerciseIds[0] }
    })
  }
}
</script>

<style scoped>
.timeline {
  position: relative;
  padding: 8px 0;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
  margin-bottom: 8px;
  animation: slide-up 0.4s ease both;
}

.timeline-item.clickable {
  cursor: pointer;
}
.timeline-item.clickable:focus-visible {
  outline: 3px solid var(--q-primary);
  outline-offset: 2px;
  border-radius: 8px;
}

/* Dot */
.timeline-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  margin-top: 8px;
  transition: transform 0.2s;
}
.is-completed .timeline-dot { background: var(--q-primary); }
.is-current .timeline-dot { background: var(--q-secondary); }
.is-locked .timeline-dot { background: #bdbdbd; animation: none; }
.timeline-item.clickable:hover .timeline-dot {
  transform: scale(1.15);
}

/* Connector line */
.timeline-line {
  position: absolute;
  left: 17px;
  top: 42px;
  width: 2px;
  height: calc(100% + 8px);
  background: #e0e0e0;
  z-index: 0;
}
.is-completed .timeline-line {
  background: var(--q-primary);
}

/* Content card */
.timeline-content {
  flex: 1;
  min-width: 0;
}
.lesson-card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.timeline-item.clickable:hover .lesson-card {
  transform: translateX(4px);
}
.is-locked {
  opacity: 0.7;
}
</style>
