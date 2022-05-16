import { ValidationError } from 'apollo-server-express'
import { GraphQLUpload } from 'graphql-upload'
import { finished } from 'stream/promises'
import path from 'path'
import fs from 'fs'
import jwt from '../../helper/JWT.js'
import permissionModel from '../permissions/model.js'
import module from './model.js'

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


                const trasnport = await module.getTransport({
                    branchId: args.branchId ? args.branchId : null,
                    search: args.search ? args.search : null
                })

                return trasnport

            } catch (error) {
                console.log(error.message)
                throw error
            }
        }
    }, 

    Trans: {
        trans_img: global => `http://localhost:4000/${global.trans_img}`
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

                const staffPermission = await permissionModel.getUserPermission({ staffId, permissionModule: 2, permission: 1 })
                // console.log(staffPermission)    // { staff_id: ..int.. , permission: bool }

                if(!staffPermission.create) {
                    throw new ValidationError('you dont have permission to add new transport!')
                }
                
                let { createReadStream, filename, mimetype } = await img
                filename = `${Date.now()}.` + mimetype.slice(6)
                
                if(!(mimetype.includes('image/'))) {
                    throw new ValidationError('only images are  allowed!')
                }
                
                const [newTrans] = await module.addNewTransport({ staffid, branchId, model, color, filename })
                console.log(newTrans)

                const stream = createReadStream()
                const out = fs.createWriteStream(path.join(process.cwd(), 'uploads', filename))
                
                stream.pipe(out);
                await finished(out)

                return {
                    status: 200,
                    message: "new car is added!",
                    data: newTrans
                }
                
            } catch (error) { 
                throw error
            }   
        },

        deleteTransport: async (_, args, { reqAgent, token }) => {
            try {
                if(!token) {
                    throw new ValidationError('token is required!')
                }

                const { agent, staffId } = jwt.verify(token)

                if(agent != reqAgent) {
                    throw new ValidationError('request is sent from different device!')
                }

                // check user permission to delete
                const staffPermission = await permissionModel.getUserPermission({ staffId, permissionModule: 2, permission: 3 })
                if(!staffPermission || !staffPermission.delete ) {
                    throw new ValidationError('you do not have permission to delete the transport!')
                }

                const [deletedTrans] = await module.deleteTransport(args) 

                if(!deletedTrans) {
                    throw new ValidationError('no such transport in this branch!')
                }

                return {
                    status: 200,
                    message: 'the transport is deleted!',
                    data: deletedTrans
                }

            } catch (error) {
                throw error
            }
        }
    }
    
}