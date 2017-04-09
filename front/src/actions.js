import axios from 'axios'
import { stringify } from 'querystring'

const request = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 1000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

const learn = async value => {
  try {
    const { status } = await request.post('/learn', stringify({ body: value }))

    console.log('ACTIONS LEARN STATUS =>', status)
  } catch (err) {
    console.error('[ERROR] Cannot learn', err)
  }
}

const predict = async () => {
  try {
    const { status, data } = await request.get('/predict')

    console.log('ACTIONS PREDICT', status, data)
  } catch (err) {
    console.error('[ERROR] Cannot predict', err)
  }
}

export default {
  learn,
  predict,
}
