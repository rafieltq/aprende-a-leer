<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-primary text-white" height-hint="56">
      <q-toolbar class="q-px-sm">
        <q-btn
          v-if="showBack"
          flat
          dense
          round
          icon="arrow_back"
          @click="goBack"
          size="md"
          aria-label="Volver"
        />
        <q-toolbar-title class="text-weight-bold flex items-center">
          <q-icon name="auto_stories" size="sm" class="q-mr-xs" />
          <span class="text-subtitle1">Aprende a Leer</span>
        </q-toolbar-title>
        <q-btn
          v-if="showHome"
          flat
          dense
          round
          icon="home"
          @click="goHome"
          size="md"
          aria-label="Inicio"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const showBack = computed(() => route.name !== 'home')
const showHome = computed(() => route.name !== 'home')

function goBack () { router.back() }
function goHome () { router.push({ name: 'home' }) }
</script>
