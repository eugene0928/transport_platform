import model from './model.js'
import permissionModel from '../permissions/model.js'
import jwt from '../../helper/JWT.js'
import { ValidationError } from 'apollo-server-express'
import { GraphQLUpload } from 'graphql-upload'
import { finished } from 'stream/promises'
import fs from 'fs'
import path from 'path'

export default {
    Upload: GraphQLUpload,

    Query: {
        transports: async (_, args, { reqAgent, token }) => {
            try {
                if(!token) {
                    throw new ValidationError('Token is required!')
                }
                
                const { staffId, agent, staffPass } = jwt.verify(token)
                if(agent != reqAgent) {
                    throw new ValidationError('Request is send from different device!')
                }


                const [trasnport] = await model.getTransport({
                    branchId: args.branchId ? args.branchId : null,
                    search: args.search ? args.search : null
                })
                 
                return {
                    status: 200,
                    message: "Transport you searched!",
                    data: trasnport
                }
            } catch (error) {
                console.log(error.message)
                throw error
            }
        }
    }, 

    Mutation: {
        addTransport: async (_, { staffid, branchId, model, color, img }, { reqAgent, token }) => {
            try {
                if(!token) {
                    throw new ValidationError('token is required!')
                }

                const { agent, staffId } = jwt.verify(token)

                if(agent != reqAgent) { 
                    throw new ValidationError('request is sent from different device!')
                }

                const [staffPermission] = await permissionModel.getUserPermission({ staffId, permissionModule: 2, permission: 1 })
                console.log(staffPermission)

                if(!staffPermission.create) {
                    throw new ValidationError('you dont have permission to add new transport!')
                }
                
                
                let { createReadStream, filename, mimetype } = await img
                filename = model

                let filePath = 'uploads/' + filename
                const [newTrans] = await model.addTransport({ staffid, branchId, model, color, filePath })

                const stream = createReadStream()
                const out = fs.createWriteStream(path.join(process.cwd(), 'uploads', filename))
                
                stream.pipe(out);
                await finished(out)

                return newTrans
                
            } catch (error) { 
                throw error
            }   
        }
    }
    
}