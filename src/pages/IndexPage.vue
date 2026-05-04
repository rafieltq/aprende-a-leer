<template>
  <q-page class="splash-page column flex-center">
    <div class="text-center q-pa-lg" style="max-width: 420px">
      <!-- Floating mascot -->
      <div class="mascot-wrapper q-mb-lg">
        <div class="mascot-float">
          <svg width="130" height="150" viewBox="0 0 120 140" aria-label="Mascota: niño campesino">
            <!-- Shadow -->
            <ellipse cx="60" cy="135" rx="35" ry="6" fill="rgba(0,0,0,0.08)" />
            <!-- Body (green shirt) -->
            <rect x="35" y="60" width="50" height="50" rx="10" fill="#8BC34A" />
            <!-- Arms -->
            <rect x="15" y="68" width="22" height="8" rx="5" fill="#FFCC80" />
            <rect x="83" y="68" width="22" height="8" rx="5" fill="#FFCC80" />
            <!-- Head -->
            <circle cx="60" cy="42" r="28" fill="#FFCC80" />
            <!-- Hair (brown tufts) -->
            <path d="M34 32 Q38 22 48 28 Q52 20 58 26 Q64 18 72 26 Q78 20 86 30" fill="#5D4037" />
            <!-- Hat brim -->
            <ellipse cx="60" cy="20" rx="40" ry="8" fill="#F44336" />
            <!-- Hat crown -->
            <rect x="36" y="0" width="48" height="22" rx="5" fill="#FFC107" />
            <!-- Hat stripes -->
            <rect x="36" y="4" width="48" height="4" rx="2" fill="#F44336" />
            <rect x="36" y="12" width="48" height="4" rx="2" fill="#F44336" />
            <!-- Eyes -->
            <circle cx="50" cy="40" r="4" fill="#333" />
            <circle cx="70" cy="40" r="4" fill="#333" />
            <!-- Eye shine -->
            <circle cx="51" cy="38" r="1.5" fill="#fff" />
            <circle cx="71" cy="38" r="1.5" fill="#fff" />
            <!-- Rosy cheeks -->
            <circle cx="42" cy="48" r="6" fill="rgba(255,150,150,0.35)" />
            <circle cx="78" cy="48" r="6" fill="rgba(255,150,150,0.35)" />
            <!-- Smile -->
            <path d="M48 52 Q60 62 72 52" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-h2 text-weight-black q-mt-none q-mb-sm splash-title">
        ¡Aprende<br />a Leer!
      </h1>
      <p class="text-subtitle1 text-grey-6 q-mb-lg splash-subtitle">
        Juega con palabras, sílabas y letras
      </p>

      <!-- Start button -->
      <q-btn
        size="xl"
        color="secondary"
        label="Comenzar"
        icon-right="play_arrow"
        @click="start"
        class="q-px-xl q-py-sm start-btn"
        rounded
        no-caps
      />

      <!-- Progress -->
      <div class="q-mt-xl" v-if="overallProgress > 0">
        <div class="row items-center q-gutter-x-sm justify-center q-mb-sm">
          <q-icon name="star" color="warning" size="20px" />
          <span class="text-grey-7 text-weight-bold">{{ Math.round(overallProgress * 100) }}% completado</span>
        </div>
        <q-linear-progress
          :value="overallProgress"
          size="12px"
          color="primary"
          class="rounded-borders"
          style="max-width: 260px"
          rounded
        />
      </div>

      <!-- Tagline when fresh start -->
      <div v-else class="q-mt-xl text-grey-5 text-caption">
        <q-icon name="auto_stories" size="20px" class="q-mr-xs vertical-middle" />
        <span>¡Empieza tu aventura!</span>
      </div>
    </div>

    <!-- Decorative blobs -->
    <div class="blob blob-1" />
    <div class="blob blob-2" />
    <div class="blob blob-3" />
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from 'stores/gameStore'

const router = useRouter()
const store = useGameStore()

const overallProgress = computed(() => store.overallProgress)

onMounted(() => {
  store.loadProgress()
})

function start () {
  router.push({ name: 'chapters' })
}
</script>

<style scoped>
.splash-page {
  background: linear-gradient(160deg, #e8f5e9 0%, #fff8e1 50%, #fce4ec 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.mascot-wrapper {
  position: relative;
  z-index: 1;
}

.mascot-float {
  animation: float 3.5s ease-in-out infinite;
}

.splash-title {
  background: linear-gradient(135deg, #4caf50, #ff9800);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  animation: slide-up 0.6s ease-out;
}

.splash-subtitle {
  animation: slide-up 0.6s ease-out 0.15s both;
}

.start-btn {
  animation: pulse-glow 2s ease-in-out infinite, bounce-in 0.5s ease-out 0.3s both;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* ── Decorative blobs ── */
.blob {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  pointer-events: none;
}
.blob-1 {
  width: 300px; height: 300px;
  background: #4caf50;
  top: -80px; right: -80px;
}
.blob-2 {
  width: 200px; height: 200px;
  background: #ff9800;
  bottom: 40px; left: -60px;
}
.blob-3 {
  width: 180px; height: 180px;
  background: #9c27b0;
  bottom: -50px; right: 20px;
}
</style>
