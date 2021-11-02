import fastify from 'fastify'

const server = fastify()

interface IQuerystring {
    username: string;
    password: string; 
}
interface IHeaders {
    'h-Custom': string; 
}

const generateLoginString = (username: string, password: string) => {
    return `user: ${username} was authenticated with password: ${password}`;
}

server.get<{
    Querystring: IQuerystring,
    Headers: IHeaders,
}>('/auth', {
    preValidation: (request, reply, done) => {
        const { username, password } = request.query
        done(username!=='admin' ? new Error('must be admin') : undefined); 
        console.log(generateLoginString(username, password))
    }
}, async (request, reply) => {
    
    const customHeader = request.headers['h-Custom'] 

    return `logged in`; 
});

server.listen(8080, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})