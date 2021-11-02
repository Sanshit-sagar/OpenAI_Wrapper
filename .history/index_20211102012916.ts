import fs from 'fs'
import path from 'path' 
import fastify from 'fastify'

const server = fastify({
    https: {
        key: fs.readFileSync(path.join(__dirname, 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'csr.pem'))
    }
})

interface IQuerystring {
    username: string;
    password: string; 
}
interface IHeaders {
    'h-Custom': string; 
}

const stringifyLoginDetails = (username: string, password: string) => {
    return `user: ${username} was authenticated with password: ${password}`;
}

server.get<{
    Querystring: IQuerystring,
    Headers: IHeaders,
}>('/auth', {
    preValidation: async (request, reply) => {
        const { username, password } = request.query
        // console.log(stringifyLoginDetails(username, password))
        return username!=='admin' ? new Error('must be admin') : undefined;
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