import { makeExecutableSchema } from '@graphql-tools/schema'

import branches from './branches/index.js'
import staffs from './staffs/index.js'
import permission from './permissions/index.js'
import transports from './transports/index.js'

export default makeExecutableSchema({
    typeDefs: [
      branches.typeDefs,
      staffs.typeDefs,
      permission.typeDefs,
      transports.typeDefs,
    ],
    resolvers: [
      branches.resolvers,
      staffs.resolvers,
      permission.resolvers,
      transports.resolvers,
    ]
})