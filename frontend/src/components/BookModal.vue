<template>
  <div v-if="show" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-lg w-full overflow-hidden">
      <div class="px-8 pt-8 pb-6 border-b border-zinc-700">
        <h2 class="text-3xl font-semibold text-white">
          {{ isEdit ? 'Редактировать книгу' : 'Новая книга' }}
        </h2>
      </div>

      <form @submit.prevent="save" class="p-8 space-y-6">
        <div>
          <label class="block text-sm text-zinc-400 mb-2">Название книги</label>
          <input v-model="form.title" required
            class="w-full bg-zinc-800 border border-zinc-600 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500">
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-zinc-400 mb-2">Год издания</label>
            <input v-model.number="form.publication_year" type="number" required
              class="w-full bg-zinc-800 border border-zinc-600 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500">
          </div>
          <div>
            <label class="block text-sm text-zinc-400 mb-2">Страниц</label>
            <input v-model.number="form.page_count" type="number" min="1"
              class="w-full bg-zinc-800 border border-zinc-600 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500">
          </div>
        </div>

        <div>
          <label class="block text-sm text-zinc-400 mb-2">Издательство</label>
          <input v-model="form.publisher"
            class="w-full bg-zinc-800 border border-zinc-600 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500">
        </div>

        <div>
          <label class="block text-sm text-zinc-400 mb-2">Жанр</label>
          <select v-model="form.genre_id" required
            class="w-full bg-zinc-800 border border-zinc-600 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500">
            <option value="" disabled>Выберите жанр</option>
            <option v-for="g in genres" :key="g.genre_id" :value="g.genre_id">
              {{ g.name || g.genre_name || g.GenreName }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-zinc-400 mb-2">Описание</label>
          <textarea v-model="form.description" rows="4"
            class="w-full bg-zinc-800 border border-zinc-600 rounded-3xl px-5 py-4 focus:outline-none focus:border-blue-500 resize-none"></textarea>
        </div>

        <div class="flex gap-4 pt-4">
          <button type="button" @click="close"
            class="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-medium transition-colors">
            Отмена
          </button>
          <button type="submit"
            class="flex-1 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-medium transition-colors">
            {{ isEdit ? 'Сохранить изменения' : 'Добавить книгу' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  book: { type: Object, default: null },
  genres: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'save'])

const isEdit = ref(false)
const form = ref({ book_id: null, title: '', publication_year: null, publisher: '', genre_id: null, page_count: null, description: '' })

watch(() => props.book, (newBook) => {
  if (newBook) {
    form.value = { ...newBook }
    isEdit.value = true
  } else {
    form.value = { book_id: null, title: '', publication_year: null, publisher: '', genre_id: null, page_count: null, description: '' }
    isEdit.value = false
  }
}, { immediate: true })

const save = () => emit('save', { ...form.value })
const close = () => emit('close')
</script>