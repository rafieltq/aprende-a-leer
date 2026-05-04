import { ref, computed, shallowRef } from 'vue'

/**
 * Drag-and-drop composable for word ordering exercises.
 *
 * Desktop: native HTML5 DnD (dragstart/dragover/drop)
 * Mobile:   tap-to-select → tap-to-place
 *
 * @param {import('vue').Ref<import('src/data/models.js').Exercise|null>} exerciseRef
 */
export function useDragAndDrop (exerciseRef) {
  // ── State ──
  const slots = ref([])          // array of (word|null) length = slots count
  const bank = ref([])           // shuffled words available in bank
  const draggedWord = ref(null)  // word being dragged (desktop)
  const selectedWord = ref(null) // word tapped on mobile
  const dragFeedback = ref('')   // 'correct' | 'incorrect' | ''
  const submitted = ref(false)

  // Internal: which slot is being dragged over (for highlight)
  const hoveredSlot = ref(-1)

  // ── Init / Reset ──
  function init () {
    const ex = exerciseRef.value
    if (!ex || ex.type !== 'dragAndDrop') return
    const bankArr = [...(ex.config.wordBank || [])]
    bank.value = shuffle(bankArr)
    slots.value = Array(ex.config.slots || bankArr.length).fill(null)
    draggedWord.value = null
    selectedWord.value = null
    dragFeedback.value = ''
    submitted.value = false
    hoveredSlot.value = -1
  }

  function reset () {
    init()
  }

  // ── Computed ──
  const allSlotsFilled = computed(() => slots.value.every(s => s !== null))

  /** The order currently in slots */
  const currentOrder = computed(() => slots.value.map(s => s))

  /** Whether the order matches the correct answer */
  const isCorrectOrder = computed(() => {
    const correct = exerciseRef.value?.correctAnswer || []
    return currentOrder.value.length === correct.length &&
      currentOrder.value.every((w, i) => w === correct[i])
  })

  const isSyllable = computed(() => exerciseRef.value?.config?.isSyllable === true)

  // ── Desktop: HTML5 DnD ──

  function onDragStart (e, word) {
    draggedWord.value = word
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', word)
  }

  function onDragOver (e, slotIndex) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    hoveredSlot.value = slotIndex
  }

  function onDragLeave () {
    hoveredSlot.value = -1
  }

  function onDrop (e, slotIndex) {
    e.preventDefault()
    const word = e.dataTransfer.getData('text/plain')
    placeWord(word, slotIndex)
    hoveredSlot.value = -1
  }

  function onDragEnd () {
    draggedWord.value = null
    hoveredSlot.value = -1
  }

  // ── Mobile: tap-select → tap-place ──

  function onWordTap (word) {
    if (submitted.value) return
    // If tapping a word that's already selected, deselect
    if (selectedWord.value === word) {
      selectedWord.value = null
      return
    }
    // If word is in bank, select it
    if (bank.value.includes(word)) {
      selectedWord.value = word
      return
    }
    // If word is in a slot, place it back to bank
    const slotIdx = slots.value.indexOf(word)
    if (slotIdx !== -1) {
      slots.value[slotIdx] = null
      addToBank(word)
    }
    selectedWord.value = null
  }

  function onSlotTap (slotIndex) {
    if (submitted.value) return
    // If slot has a word, return it to bank
    if (slots.value[slotIndex] !== null) {
      const word = slots.value[slotIndex]
      slots.value[slotIndex] = null
      addToBank(word)
      selectedWord.value = null
      return
    }
    // If a word is selected, place it
    if (selectedWord.value !== null) {
      placeWord(selectedWord.value, slotIndex)
      selectedWord.value = null
    }
  }

  // ── Core placement logic ──

  function placeWord (word, slotIndex) {
    if (slotIndex < 0 || slotIndex >= slots.value.length) return

    // If slot already has a word, swap with bank
    const existing = slots.value[slotIndex]
    if (existing !== null) {
      const bankIdx = bank.value.indexOf(word)
      if (bankIdx !== -1) {
        bank.value[bankIdx] = existing
      }
      slots.value[slotIndex] = word
    } else {
      // Place word into empty slot
      slots.value[slotIndex] = word
      removeFromBank(word)
    }
  }

  function removeFromBank (word) {
    const idx = bank.value.indexOf(word)
    if (idx !== -1) bank.value.splice(idx, 1)
  }

  function addToBank (word) {
    if (word && !bank.value.includes(word)) {
      bank.value.push(word)
    }
  }

  // ── Submit ──

  function submit () {
    if (submitted.value) return { correct: false, score: 0 }
    submitted.value = true

    const correct = isCorrectOrder.value
    dragFeedback.value = correct ? 'correct' : 'incorrect'
    // Score: 2 if correct on first try (handled by caller tracking attempts)
    return { correct, score: correct ? 2 : 0 }
  }

  // ── Helpers ──

  function shuffle (arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  return {
    // state
    slots,
    bank,
    selectedWord,
    draggedWord,
    dragFeedback,
    submitted,
    hoveredSlot,
    // computed
    allSlotsFilled,
    currentOrder,
    isCorrectOrder,
    isSyllable,
    // actions
    init,
    reset,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
    onWordTap,
    onSlotTap,
    submit
  }
}
