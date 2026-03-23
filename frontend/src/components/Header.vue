<template>
  <header class="bg-zinc-900 border-b border-zinc-700 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center gap-6">
      <h1 class="text-4xl font-bold text-white tracking-tight">Библиотека</h1>

      <button
        @click="$emit('add-book')"
        class="ml-auto bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-3 rounded-2xl font-medium flex items-center gap-2 shadow-lg shadow-blue-500/30"
      >
        <span class="text-xl">+</span>
        Новая книга
      </button>

      <div class="flex-1 flex flex-col sm:flex-row gap-4 max-w-2xl">
        <select
          :value="selectedGenreId"
          @change="$emit('update:selectedGenreId', $event.target.value)"
          class="bg-zinc-800 border border-zinc-600 text-white rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Все жанры</option>
          <option v-for="genre in genres" :key="genre.genre_id" :value="genre.genre_id">
            {{ genre.name || genre.genre_name || genre.GenreName }}
          </option>
        </select>

        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text"
          placeholder="Поиск книги по названию..."
          class="flex-1 bg-zinc-800 border border-zinc-600 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-500"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  genres: { type: Array, default: () => [] },
  searchQuery: { type: String, default: '' },
  selectedGenreId: { type: [String, Number], default: '' }
})
</script>