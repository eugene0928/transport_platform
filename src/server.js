import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core'
import  {graphqlUploadExpress} from 'graphql-upload'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import http from 'http'
import '#config/index'
import { join } from 'path'

import schema from './modules/index.js'

!async function () {
    const app = express()
    const httpServer = http.createServer(app)
    
    app.use(graphqlUploadExpress())
    
    const server = new ApolloServer({
        context: ({req, res}) => {
            return {
                reqAgent: req.headers['user-agent'],
                token: req.headers.token
            }
        },
        schema,
        csrfPrevention: true,
        introspection: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground()
        ],
    })

    await server.start()
    server.applyMiddleware({ app })
    await new Promise(resolve => httpServer.listen({ port: process.env.PORT || 4000 }, resolve))
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}()
