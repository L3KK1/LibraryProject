<template>
  <div class="library-app">
    <h1 class="title">Библиотека</h1>

    <!-- Состояние загрузки -->
    <div v-if="loading" class="loading">
      Загрузка книг...
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <!-- Таблица -->
    <table class="books-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Год</th>
          <th>Издательство</th>
          <th>Жанр ID</th>
          <th>Страниц</th>
          <th>Описание</th>
        </tr>
      </thead>
      <tbody>
        <TableItem 
          v-for="book in books" 
          :key="book.book_id"
          :book="book"
          class="item"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted  } from 'vue'
import TableItem from './components/TableItem.vue';

// Реактивные переменные
const books = ref([])        // Массив книг (пустой изначально)
const loading = ref(false)   // Флаг загрузки
const error = ref(null)      // Ошибка если есть

// const books = ref([
//   {
//     book_id: 1,
//     title: 'Война и мир',
//     publication_year: 1869,
//     publisher: 'Русский вестник',
//     genre_id: 1,
//     page_count: 1225,
//     description: 'Роман-эпопея о войне 1812 года'
//   },
//   {
//     book_id: 2,
//     title: 'Преступление и наказание',
//     publication_year: 1866,
//     publisher: 'Русский вестник',
//     genre_id: 1,
//     page_count: 672,
//     description: 'Психологический роман о Раскольникове'
//   },
//   {
//     book_id: 3,
//     title: 'Метро 2033',
//     publication_year: 2005,
//     publisher: 'Популярная литература',
//     genre_id: 3,
//     page_count: 400,
//     description: 'Постапокалиптический роман о Московском метро'
//   }
// ])

const fetchBooks = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('http://localhost:3001/api/books')
    
    // Проверяем, успешен ли ответ
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`)
    }
    
    const result = await response.json()
    
    // Проверяем структуру ответа
    if (result.success) {
      books.value = result.data
    } else {
      throw new Error(result.message || 'Неизвестная ошибка')
    }
    
  } catch (err) {
    error.value = 'Не удалось загрузить книги: ' + err.message
    console.error('Ошибка загрузки:', err)
  } finally {
    loading.value = false
  }
}

// Загружаем книги при открытии страницы
onMounted(() => {
  fetchBooks()
})
</script>

<style>

h1 {
  color: #cfd2d6; /* Тёмный цвет заголовка */
  margin-bottom: 20px;
}

.books-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: rgb(189, 52, 52); 
}

.books-table th,
.books-table td {
  border: 1px solid #e2e8f0;
  padding: 12px;
  text-align: left;
  color: #2d3748; 
}

.books-table th {
  background-color: #2d3748;
  color: rgb(255, 253, 253);
  font-weight: bold;
}

.books-table tr:nth-child(even) {
  background-color: #cacaca;
}

.books-table tr:nth-child(odd) {
  background-color: #ffffff;
}


.books-table td {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Описание — разрешаем перенос */
.books-table td:last-child {
  white-space: normal;
  max-width: 400px;
}

tr.item:hover {
  cursor: pointer;
  background-color: #a1c2fa;
}

.title {
  color: #2d3748;
}
</style>