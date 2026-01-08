import { createServer } from 'node:http'
import { toNodeListener } from 'h3'
import { useNitroApp } from 'nitro/runtime'

const app = useNitroApp().h3App
const server = createServer(toNodeListener(app))
server.listen(3030, () => {
  console.log('Server is running on http://localhost:3030')
})
