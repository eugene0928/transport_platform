import { ValidationError, UserInputError } from 'apollo-server-errors'
import model from './model.js'
import permissionModule from '../permissions/model.js'
import branchesModel from '../branches/model.js'
import jwt from '../../helper/JWT.js'

export default {
    Mutation: {
        register: async (_, args, { agent }) => {
            // get all info from db
            const staffs = await model.getStaffs({pass: 'super'})
            const branches = await branchesModel.getBranches({ pass: 'super' })

            // validation
            if(
                staffs.find(staff => staff.staff_name.toLowerCase() == args.staffname.toLowerCase()) ||
                !(branches.find(branch => branch.branch_id == args.branchId)) ||
                !(args.pass?.trim()) ||
                (args.pass.trim()).length < 4 ||
                !(args.repeat_pass.trim()) ||
                args.pass != args.repeat_pass ||
               !(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test( args.birthDate ))
            ) {
                throw new ValidationError("Invalid input error! HINT: 1. staff might already exists 2. wrong branch 3. wrong password 4. wrong birthdate, 5. wrong gender type")
            }
            
            if(args.gender && !([1, 2].includes(args.gender))) {
                throw new ValidationError("Invalid input error! HINT: 1. staff might already exists 2. wrong branch 3. wrong password 4. wrong birthdate, 5. wrong gender type")
            }

            // add new user and his permissions
            const newStaff = await model.addStaff(args)
            await model.addTransPer({staff_id: newStaff.staff_id})
            await model.addBranchPer({staff_id: newStaff.staff_id})
            await model.addPermissionsPer({staff_id: newStaff.staff_id})

            //give token
            const token = jwt.sign({ staffId: newStaff.staff_id, agent, staffPass: newStaff.staff_password })
            return {
                status: 200,
                message: "The staff is registered!",
                data: newStaff,
                token
            }
        },

        login: async (_, args, { reqAgent }) => {
            // get data from db
            const staff = await model.getStaff(args) 
            if(!staff) {
                throw new UserInputError('No such user is found!')
            }
            //token
            const token = jwt.sign({ staffId: staff.staff_id, agent: reqAgent, staffPass: staff.staff_password })
            return {
                status: 200,
                message: "The staff is logged in!",
                data: staff,
                token
            }
        }
    },
 
    Query: {
        staffs: async (_, __, { reqAgent, token }) => {
            try {
                if(!token) {
                    throw new ValidationError('token is required!')
                }

                const { staffId, agent, staffPass } = jwt.verify(token)
                if(reqAgent != agent) {
                    throw new ValidationError('Request is sent from different device!')
                }

                const currentStaff = await permissionModule.getUserPermission({staffId, permissionModule: 3, permission:2})
                if(currentStaff?.read) {
                    return await model.getStaffs({pass: 'super'})
                }

                return [await model.getStaffs({})]
            } catch (error) {
                throw error
            }
        }
    },

    Staff: {
        staffId: global => global.staff_id,
        branch: async global => {
            const branches = await branchesModel.getBranches({pass:'super'})
            return branches.find(branch => branch.branch_id = global.branch_id)
        },
        staffName: global => global.staff_name,
        staffBirthDate: global => {
            return new Date(global.staff_birth_date).toISOString().slice(0, 10);
        },
        staffGender: global => global.staff_gender == 1 ? 'male' : 'female'
    }
}