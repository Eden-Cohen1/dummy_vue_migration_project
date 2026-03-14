// WebSocket service for real-time updates
// Used by eventBusMixin and notification components

let socket = null
const subscribers = new Map()

export function connect(url = 'ws://localhost:8080') {
  if (socket && socket.readyState === WebSocket.OPEN) return socket

  socket = new WebSocket(url)

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    const handlers = subscribers.get(data.channel) || []
    handlers.forEach((handler) => handler(data.payload))
  }

  socket.onclose = () => {
    setTimeout(() => connect(url), 5000)
  }

  return socket
}

export function disconnect() {
  if (socket) {
    socket.close()
    socket = null
  }
}

export function subscribe(channel, handler) {
  if (!subscribers.has(channel)) {
    subscribers.set(channel, [])
  }
  subscribers.get(channel).push(handler)

  return () => unsubscribe(channel, handler)
}

export function unsubscribe(channel, handler) {
  const handlers = subscribers.get(channel) || []
  const index = handlers.indexOf(handler)
  if (index > -1) handlers.splice(index, 1)
}
