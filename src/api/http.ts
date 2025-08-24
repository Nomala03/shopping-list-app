import axios from 'axios'

export const http = axios.create({
  baseURL: 'http://localhost:3000', // JSON Server base URL
  headers: { 'Content-Type': 'application/json' }
})