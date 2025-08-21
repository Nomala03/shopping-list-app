import axios from 'axios'

export const API_BASE = 'http://localhost:5000'

export const http = axios.create({ baseURL: API_BASE })