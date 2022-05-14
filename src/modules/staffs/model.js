import { ValidationError } from 'apollo-server-express'
import db from '#pg'
import query from './sql.js'

async function getStaffs({ pass }) {
    if(pass == 'super')
        return await db(query.GET_STAFFS)
    else 
        throw new ValidationError('You have not permission to see all staffs!')
}

async function getStaff({ staffname, pass, staffId }) {
    let staff
    if(staffname){
        [staff] =  await db(query.GET_STAFF, pass, staffname)
    } else {
        [staff] =  await db(query.GET_STAFF_WITH_ID, pass, staffId)
    }
    
    return staff
}

async function addStaff({ staffname, branchId, pass, birthDate, gender }) {
    const [newStaff] = await db(query.ADD_STAFF, branchId, staffname, pass, birthDate, gender)
    return newStaff
}

async function addTransPer({ staff_id }) {
    await db(query.ADDTRANS_PER, staff_id)
    return
}

async function addBranchPer({ staff_id }) {
    await db(query.ADDBRANCHES_PER, staff_id)
    return
}

async function addPermissionsPer({ staff_id }) {
    await db(query.ADDPERMISSIONS_PER, staff_id)
    return
}

export default {
    getStaffs,
    getStaff,
    addStaff,
    addTransPer,
    addBranchPer,
    addPermissionsPer,
}