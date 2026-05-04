<template>
  <q-page class="q-pa-md q-pt-lg">
    <h2 class="text-h4 text-weight-black text-center q-mt-none q-mb-lg text-primary">
      Elige un capítulo
    </h2>

    <div class="row q-col-gutter-lg justify-center">
      <div
        v-for="(chapter, idx) in store.chapters"
        :key="chapter.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card
          class="chapter-card"
          :class="{ 'chapter-completed': chapterProgress(chapter.id) >= 1 }"
          @click="openChapter(chapter.id)"
          tabindex="0"
          @keydown.enter="openChapter(chapter.id)"
          v-bind:style="{ animationDelay: `${idx * 0.08}s` }"
        >
          <!-- Top color stripe -->
          <div class="stripe" :style="{ background: stripeColor(idx) }" />

          <q-card-section class="text-center q-pt-xl q-pb-md">
            <div class="icon-circle" :style="{ background: iconBg(idx) }">
              <q-icon
                :name="icons[chapter.icon] || 'book'"
                size="40px"
                color="white"
              />
            </div>

            <div class="text-h6 text-weight-bold q-mt-md q-mb-xs">
              {{ chapter.title }}
            </div>
            <div class="text-caption text-grey-6">
              {{ chapter.description }}
            </div>
          </q-card-section>

          <!-- Progress bar -->
          <q-card-section class="q-pt-none q-pb-md q-px-lg">
            <div class="row items-center q-gutter-x-sm q-mb-xs">
              <q-icon
                v-if="chapterProgress(chapter.id) >= 1"
                name="check_circle"
                color="primary"
                size="20px"
              />
              <span class="text-caption text-grey-6">
                {{ chapterProgress(chapter.id) >= 1
                  ? 'Completado'
                  : `${completedLessons(chapter.id)} lecciones` }}
              </span>
            </div>
            <q-linear-progress
              :value="chapterProgress(chapter.id)"
              size="8px"
              :color="chapterProgress(chapter.id) >= 1 ? 'primary' : 'secondary'"
              rounded
              class="q-mt-sm"
            />
          </q-card-section>

          <!-- Bottom accent -->
          <div class="card-footer" :style="{ background: stripeColor(idx) }" />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from 'stores/gameStore'

const router = useRouter()
const store = useGameStore()

const icons = {
  abc: 'abc',
  puzzle: 'extension',
  book: 'book'
}

const colors = ['#D12052', '#03AED2', '#F8DE22', '#F45B26']

function stripeColor (idx) { return colors[idx % colors.length] }
function iconBg (idx) { return colors[idx % colors.length] }

const chapterProgress = computed(() => (chapterId) => {
  return store.chapterProgress(chapterId)
})

const completedLessons = computed(() => (chapterId) => {
  const lessons = store.lessonsForChapter(chapterId)
  const done = lessons.filter(l => store.progress[l.id]?.completed).length
  return `${done}/${lessons.length}`
})

function openChapter (chapterId) {
  router.push({ name: 'lessons', params: { chapterId } })
}
</script>

<style scoped>
.chapter-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  animation: slide-up 0.5s ease both;
}
.chapter-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
}
.chapter-card:focus-visible {
  outline: 3px solid var(--q-primary);
  outline-offset: 2px;
}
.chapter-card:active {
  transform: translateY(-2px);
}

.chapter-completed {
  opacity: 0.8;
}

/* Top stripe */
.stripe {
  height: 8px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

/* Bottom footer */
.card-footer {
  height: 4px;
  width: 100%;
  opacity: 0.3;
}

/* Icon circle */
.icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>
