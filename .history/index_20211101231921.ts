import fastify from 'fastify'

const server = fastify()

interface IQueryString {
    username: string;
    password: string; 
}
interface IHeaders {
    'h-Custom': string; 
}

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.get<{
    
}

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})