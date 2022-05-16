import { ValidationError, UserInputError, ForbiddenError, ApolloError,  } from 'apollo-server-errors'
import model from './model.js'
import staffModel from '../staffs/model.js'
import branchModel from '../branches/model.js'
import jwt from '../../helper/JWT.js'
// import NotFoundError from "#error"

export default {
    Mutation: {
        addPermission: async (_, args, { reqAgent, token }) => {
            try {
                // token unfold
            if(!token) {
                throw new ValidationError('Token is required!')
            }

            const { staffId, agent, staffPass } = jwt.verify(token)

            if(agent != reqAgent) {
                throw new ValidationError('Request is sent from different device!')
            }

            const staff = await staffModel.getStaff({staffId, staffPass})
            const branches = await branchModel.getBranches({pass: 'super'})
            // console.log(staffId, staffPass)
            if(!staff) {
                throw new UserInputError('Such user is not found!')
            }

            if(!(branches.find(branch => branch.branch_id == args.branchId))) {
                throw new UserInputError('Such branch is not fount!')
            }

            const currentStaffPermissions = await model.getUserPermission({staffId, permissionModule: args.permissionModule, permission: args.permission})
            if(currentStaffPermissions.create || currentStaffPermissions.read || currentStaffPermissions.delete || currentStaffPermissions.update) {
                const StaffPermission = await model.addPermission(args)
                return {
                    status: 200,
                    message: 'permission is changed!'
                }
            } else {
                throw new ValidationError('You have not permission to give permission to others!')
            }
            
            } catch (error) {
                console.log(error)
                throw error
            }
        }
    },

    Query: {
        getUserPermission: async (_, args, { reqAgent, token }) => {
            try {
                //token verification
                const { agent, staffId, staffPass } = jwt.verify(token)
                if(agent != reqAgent) {
                    throw new ValidationError('Request is sent from different device!')
                }
                const staff = await staffModel.getStaff({staffId, staffPass})
                // console.log(staffId, staffPass)
                if(!staff) {
                    throw new UserInputError('Such user is not found!')
                }

                const currentStaffPermissions = await model.getUserPermission({staffId, permissionModule: args.permissionModule, permission: args.permission})
                const staffPermissions = await model.getUserPermission(args)

                if(staffId != args.staffId && !currentStaffPermissions.read) {
                    return {
                        status: 200,
                        message: "You dont have permission to see others' permissions. See only yours",
                        data: currentStaffPermissions
                    }
                } else if(staffId != args.staffId && currentStaffPermissions.read) {
                    return {
                        status: 200,
                        message: `Permissoins of user whose id is ${staffPermissions.staffId}`,
                        data: staffPermissions
                    }
                } else if(staffId == args.staffId){
                    return {
                        status: 200,
                        message: "Your permissions",
                        data: currentStaffPermissions
                    }
                }

            } catch (error) {
                throw new ForbiddenError(error.message)
            }
        },
        
        allPermissions: async (_, args, { reqAgent, token }) => {
           try {
                if(!token) {
                    throw new ValidationError('token is required!')
                }
                const { staffId, agent } = jwt.verify(token)

                if(agent != reqAgent) {
                    throw new ValidationError('request is sent from different device!')
                }

                const [perms] = await model.allPermissions({staffId})

                return perms
           } catch (error) {
               throw error
           }

        }
        
    }
}