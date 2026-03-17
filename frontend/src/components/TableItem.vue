<template>
  <tr>
    <td>{{ book.book_id }}</td>
    <td>{{ book.title }}</td>
    <td>{{ book.publication_year }}</td>
    <td>{{ book.publisher }}</td>
    <td>{{ genreName }}</td>
    <td>{{ book.page_count }}</td>
    <td class="description">{{ book.description }}</td>
    <td class="actions">
      <button class="btn-edit" @click="$emit('edit', book)">✏️</button>
      <button class="btn-delete" @click="$emit('delete', book.book_id)">🗑️</button>
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  book: { type: Object, required: true },
  genres: { type: Array, default: () => [] }
})

const genreName = computed(() => {
  const g = props.genres.find(gen => gen.genre_id === props.book.genre_id)
  return g ? (g.name || g.genre_name || g.genreName || `Жанр ${props.book.genre_id}`) : '—'
})
</script>

<style scoped>
.actions button {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  margin: 0 6px;
}
.btn-edit  { color: #2563eb; }
.btn-delete { color: #dc2626; }
.description { white-space: normal; }
</style>