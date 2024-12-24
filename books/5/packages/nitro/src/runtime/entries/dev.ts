import '~polyfill'
import { Server } from 'node:http'
import { parentPort } from 'node:worker_threads'
import type { AddressInfo } from 'node:net'
import { handle } from '../server'

const server = new Server(handle)

const netServer = server.listen(0, () => {
  parentPort.postMessage({
    event: 'listen',
    port: (netServer.address() as AddressInfo).port,
  })
})
