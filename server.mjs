import http from 'node:http'
import fs from 'node:fs/promises'

const port = 3000
const host = '0.0.0.0'
const logFile = 'server.log'

const getCurrentTime = () => {
  const date = new Date()

  const year = date.getUTCFullYear().toString()
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = (date.getUTCDate()).toString().padStart(2, '0')
  const hours = (date.getUTCHours()).toString().padStart(2, '0')
  const minutes = (date.getUTCMinutes()).toString().padStart(2, '0')
  const seconds = (date.getUTCSeconds()).toString().padStart(2, '0')

  return `${ day }-${ month }-${ year } ${ hours }:${ minutes }:${ seconds }`
}

const getClient = (request) => {
  return {
    address: request.socket.remoteAddress,
    port: request.socket.remotePort,
    userAgent: request.headers['user-agent']
  }
}

const log = async (logMessage, logFile) => {
  console.log(logMessage)
  if (logFile) {
    await fs.appendFile(logFile, logMessage + '\n', 'utf8')
  }
}

try {
  await fs.access(logFile)
  await fs.unlink(logFile)
} catch (_) {}

const server = http.createServer(async (request, response) => {
  const time = getCurrentTime()
  const client = getClient(request)

  response.statusCode = 200
  response.setHeader('Content-Type', 'text/html')
  response.end('hello, world!')

  await log(`client,"${ time }",${ request.url },${ response.statusCode },${ client.address }:${ client.port },"${ client.userAgent }"`, logFile)
})

server.listen(port, host, async () => {
  await log(`server,"${ getCurrentTime() }","start listening on ${ host }:${ port }"`, logFile)
})
