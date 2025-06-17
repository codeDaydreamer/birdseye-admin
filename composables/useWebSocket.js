import { ref, onUnmounted } from 'vue'
import { useRuntimeConfig } from '#app'

export function useWebSocket(token) {
  const socket = ref(null)
  const messages = ref([])
  const isConnected = ref(false)

  function connect() {
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBaseURL.replace(/^http/, 'ws')
    const wsUrl = `${baseUrl}/ws?token=${token}`

    socket.value = new WebSocket(wsUrl)

    socket.value.onopen = () => {
      isConnected.value = true
      console.log('WebSocket connected')
    }

    socket.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        messages.value.push(data)
      } catch (e) {
        console.error('Error parsing WebSocket message:', e)
      }
    }

    socket.value.onclose = () => {
      isConnected.value = false
      console.log('WebSocket disconnected')
    }

    socket.value.onerror = (err) => {
      console.error('WebSocket error:', err)
    }
  }

  function sendMessage(msg) {
    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify(msg))
    }
  }

  onUnmounted(() => {
    if (socket.value) socket.value.close()
  })

  return { connect, sendMessage, messages, isConnected }
}
