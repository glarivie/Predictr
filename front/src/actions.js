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

    if (status !== 200) { throw new Error('[ERROR] Cannot learn') }
  } catch (err) {
    console.error(err)
  }
}

const predict = async value => {
  try {
    if (!value.length) { return }

    const req = '/predict?' + stringify({ body: value })
    const { status, data } = await request.get(req)

    if (status !== 200) { return [] }
    return data
  } catch (err) {
    console.error('[ERROR] Cannot predict', err)
  }
}

export default {
  learn,
  predict,
}
