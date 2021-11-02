import fastify from 'fastify'

const server = fastify()

interface IQuerystring {
    username: string;
    password: string; 
}
interface IHeaders {
    'h-Custom': string; 
}

server.get<{
    Querystring: IQuerystring,
    Headers: IHeaders,
}>('/auth', async (request, reply) => {
    const { username, password } = request.query
    const customHeader = request.headers['h-Custom'] 

    return `logged in`
});

server.listen(8080, (err, address) => {
    console.log(`recieved a request`);
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})