import fastify from 'fastify'

const server = fastify()

interface IQueryString

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})