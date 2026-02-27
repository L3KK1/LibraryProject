<template>
  <tr>
    <td>{{ book.book_id }}</td>
    <td>{{ book.title }}</td>
    <td>{{ book.publication_year }}</td>
    <td>{{ book.publisher }}</td>
    <td>{{ book.genre_id }}</td>
    <td>{{ book.page_count }}</td>
    <td>{{ book.description }}</td>
  </tr>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true
  }
})
</script>