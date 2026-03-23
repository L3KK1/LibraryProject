<!-- src/components/TableItem.vue -->
<template>
  <tr class="group hover:bg-zinc-800/70 transition-colors duration-200">
    <!-- ID -->
    <td class="px-6 py-5 text-center font-mono text-zinc-400 text-sm">
      {{ book.book_id }}
    </td>

    <!-- Название -->
    <td class="px-6 py-5 font-medium text-white">
      {{ book.title }}
    </td>

    <!-- Год -->
    <td class="px-6 py-5 text-center text-zinc-300">
      {{ book.publication_year || '—' }}
    </td>

    <!-- Издательство -->
    <td class="px-6 py-5 text-zinc-300">
      {{ book.publisher || '—' }}
    </td>

    <!-- Жанр -->
    <td class="px-6 py-5 text-center">
      <span class="inline-block px-4 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-full">
        {{ genreName }}
      </span>
    </td>

    <!-- Страниц -->
    <td class="px-6 py-5 text-center font-medium text-emerald-400">
      {{ book.page_count || '—' }}
    </td>

    <!-- Описание -->
    <td class="px-6 py-5 text-sm text-zinc-400 max-w-xs">
      <div class="line-clamp-2">
        {{ book.description || 'Нет описания' }}
      </div>
    </td>

    <!-- Действия -->
    <td class="px-6 py-5">
      <div class="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <button
          @click.stop="$emit('edit', book)"
          class="w-9 h-9 flex items-center justify-center text-blue-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
          title="Редактировать"
        >
          ✏️
        </button>
        <button
          @click.stop="$emit('delete', book.book_id)"
          class="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
          title="Удалить"
        >
          🗑️
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  book: {
    type: Object,
    required: true
  },
  genres: {
    type: Array,
    default: () => []
  }
})

const genreName = computed(() => {
  const genre = props.genres.find(g => g.genre_id === props.book.genre_id)
  return genre 
    ? (genre.name || genre.genre_name || genre.GenreName || `Жанр ${props.book.genre_id}`)
    : '—'
})
</script>