import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'chapters',
        name: 'chapters',
        component: () => import('pages/ChaptersPage.vue')
      },
      {
        path: 'chapter/:chapterId/lessons',
        name: 'lessons',
        component: () => import('pages/LessonsPage.vue'),
        props: true
      },
      {
        path: 'lesson/:lessonId/exercise/:exerciseId',
        name: 'exercise',
        component: () => import('pages/ExercisePage.vue'),
        props: true
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
