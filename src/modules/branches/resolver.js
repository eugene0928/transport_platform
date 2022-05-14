import { ValidationError } from 'apollo-server-express'
import model from './model.js'
import jwt from '../../helper/JWT.js'
import permissionModel from '../permissions/model.js'

export default {
    Query: {
        branches: async (_, __, { reqAgent, token }) => {

            try {
                const branches = await model.getBranches({pass: 'super'})
                const { staffId, agent } = jwt.verify(token)

                if(agent != reqAgent) {
                    throw new ValidationError('request is sent from different device!')
                }

                const staffPermission = await permissionModel.getUserPermission({staffId, permissionModule: 3, permission: 2})

                if(!staffPermission.read) {
                    throw new ValidationError('You dont have permission to see all branches!')
                }

                return branches
            } catch (error) {
                throw error
            }
        },

    },

    // Branch: {
    //     branchId: global => global.branch_id,
    //     branchName: global => global.branch_name,
    //     branchAddress: global => global.branch_address
    // }, 

    Mutation: {
        addBranch: async(_, args, { reqAgent, token }) => {
            try {
                if(!token) {
                    throw new ValidationError('token is required!')
                }

                const { staffId, agent } = jwt.verify(token)
                
                if(agent != reqAgent) {
                    throw new ValidationError('request is sent from different device!')
                }

                const staffPermission = await permissionModel.getUserPermission({staffId, permissionModule: 1, permission: 1})

                if(!staffPermission.create) {
                    throw new ValidationError('You have not permisison to add new branch!')
                }

                const allBranches = await model.getBranches({pass: 'super'})

                if(allBranches.find(branch => branch.branch_name == args.branchName)) {
                    throw new ValidationError('this branch already exists!')
                }

                const [newBranch] = await model.addNewBranch(args)
                return {
                    status: 200,
                    message: 'new branch is added!',
                    data: newBranch
                }

            } catch (error) {
                throw error
            }
        },
        deleteBranch: async(_, args, { reqAgent, token }) => {
            try {
                if(!token) {
                    throw new ValidationError('token is required!')
                }

                const { staffId, agent } = jwt.verify(token)
                
                if(agent != reqAgent) {
                    throw new ValidationError('request is sent from different device!')
                }

                const staffPermission = await permissionModel.getUserPermission({staffId, permissionModule: 1, permission: 3})

                if(!staffPermission.delete) {
                    throw new ValidationError('You have not permisison to add new branch!')
                }

                const allBranches = await model.getBranches({pass: 'super'})

                if(!(allBranches.find(branch => branch.branch_id == args.branchId))) {
                    throw new ValidationError('this branch does not exist!')
                }

                const [branch] = await model.deleteBranch(args)
                return {
                    status: 200,
                    message: 'branch is deleted!',
                    data: branch
                } 

            } catch (error) {
                throw error
            }
        }
    },

    
}