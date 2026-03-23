<template>
  <div class="bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden shadow-2xl">
    <table class="w-full">
      <thead>
        <tr class="bg-zinc-800 border-b border-zinc-700">
          <th class="px-6 py-5 text-left font-medium text-zinc-400">ID</th>
          <th class="px-6 py-5 text-left font-medium text-zinc-400">Название</th>
          <th class="px-6 py-5 text-center font-medium text-zinc-400">Год</th>
          <th class="px-6 py-5 text-left font-medium text-zinc-400">Издательство</th>
          <th class="px-6 py-5 text-center font-medium text-zinc-400">Жанр</th>
          <th class="px-6 py-5 text-center font-medium text-zinc-400">Страниц</th>
          <th class="px-6 py-5 text-left font-medium text-zinc-400">Описание</th>
          <th class="px-6 py-5 text-center font-medium text-zinc-400">Действия</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-700">
        <TableItem
          v-for="book in books"
          :key="book.book_id"
          :book="book"
          :genres="genres"
          @edit="$emit('edit', book)"
          @delete="$emit('delete', book.book_id)"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup>
import TableItem from './TableItem.vue'
defineProps({
  books: { type: Array, required: true },
  genres: { type: Array, default: () => [] }
})
</script>