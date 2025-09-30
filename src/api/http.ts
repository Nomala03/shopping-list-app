import axios from 'axios'

export const http = axios.create({
  baseURL: '', // JSON Server base URL
  headers: { 'Content-Type': 'application/json' }
});