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
}>('/auth', {
    prevalidation: (request, reply, done) => {
        
    
        }
    }, async (request, reply) => {
        const { username, password } = request.query
        const customHeader = request.headers['h-Custom'] 

        return `user: ${username} was authenticated with password: ${password}`; 
});

server.listen(8080, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})