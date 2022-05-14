import { ValidationError } from 'apollo-server-express'
import db from '#pg'
import query from './sql.js'


async function getUserPermission({ staffId, permissionModule, permission }) {
    let module = permissionModule == 1 ? 'branches_per' : permissionModule == 2 ? 'transport_per' : 'permissions_per'
    let column_name = module == 'branches_per' ? 'branch' : module == 'transport_per' ? 'trans' : 'per'
    let perm_type = permission == 1 ? 'create' : permission == 2 ? 'read' : permission == 3 ? 'delete' : 'update'
    
    if(permissionModule == 1) {
        const [data] = await db(query.GET_STAFF_BRANCH_PER, staffId)
        if(permission) {
            return {
                staff_id: data?.staff_id,
                [`${perm_type}`]: data?.[`${column_name}_${perm_type}`]
            }
        }

        return {
            staffId: data?.staff_id,
            [`create`]: data?.[`${column_name}_create`],
            [`read`]: data?.[`${column_name}_read`],
            [`delete`]: data?.[`${column_name}_delete`],
            [`update`]: data?.[`${column_name}_update`]
        }
   } else if(permissionModule == 2) {
    const [data] = await db(query.GET_STAFF_TRANS_PER, staffId)
    if(permission) {
        return {
            staff_id: data?.staff_id,
            [`${perm_type}`]: data?.[`${column_name}_${perm_type}`]
        }
    }

    return {
        staffId: data?.staff_id,
        [`create`]: data?.[`${column_name}_create`],
        [`read`]: data?.[`${column_name}_read`],
        [`delete`]: data?.[`${column_name}_delete`],
        [`update`]: data?.[`${column_name}_update`]
    }
   } else if(permissionModule == 3) {
    const [data] = await db(query.GET_STAFF_PERMS_PER, staffId)
        if(permission) {
            return {
                staff_id: data?.staff_id,
                [`${perm_type}`]: data?.[`${column_name}_${perm_type}`]
            }
        }

        return {
            staffId: data?.staff_id,
            [`create`]: data?.[`${column_name}_create`],
            [`read`]: data?.[`${column_name}_read`],
            [`delete`]: data?.[`${column_name}_delete`],
            [`update`]: data?.[`${column_name}_update`]
        }
   }
}

async function addPermission({ staffId, branchId, permissionModule, permission, value }) {
    let module = permissionModule == 1 ? 'branches_per' : permissionModule == 2 ? 'transport_per' : 'permissions_per'
    let column_name = module == 'branches_per' ? 'branch' : module == 'transport_per' ? 'trans' : 'per'
    let perm_type = permission == 1 ? 'create' : permission == 2 ? 'read' : permission == 3 ? 'delete' : 'update'
    let type = `${column_name}_${perm_type}`
    
    let staffPer
    if(permissionModule == 1) {
        if(permission == 1) {
            console.log(type)
            [staffPer] = await db(query.ADD_PERMISSION_ON_BRANCH_CREATE, value, staffId)
        } else if(permission == 2) {
            [staffPer] = await db(query.ADD_PERMISSION_ON_BRANCH_READ, value, staffId)
        } else if(permission == 3) {
            [staffPer] = await db(query.ADD_PERMISSION_ON_BRANCH_DELETE, value, staffId)
        }else if(permission == 4) {
            [staffPer] = await db(query.ADD_PERMISSION_ON_BRANCH_UPDATE, value, staffId)
        }

    } else if(permissionModule == 2) {
        if(permission == 1) {
            console.log(type)
            [staffPer] = await db(query.ADD_PERMISSION_ON_TRANS_CREATE, value, staffId)
        } else if(permission == 2) {
            [staffPer] = await db(query.ADD_PERMISSION_ON_TRANS_READ, value, staffId)
        } else if(permission == 3) {
            [staffPer] = await db(query.ADD_PERMISSION_ON_TRANS_DELETE, value, staffId)
        }else if(permission == 4) {
            [staffPer] = await db(query.ADD_PERMISSION_ON_TRANS_UPDATE, value, staffId)
        }

    } else if(permissionModule == 3) {
        if(permission == 1) {
            console.log(type)
            [staffPer] = await db(query.ADD_PERMISSION_ON_PERM_CREATE, value, staffId)
        } else if(permission == 2) {
            [staffPer] = await db(query.ADD_PERMISSION_ON_PERM_READ, value, staffId)
        } else if(permission == 3) {
            [staffPer] = await db(query.ADD_PERMISSION_ON_PERM_DELETE, value, staffId)
        }else if(permission == 4) {
            [staffPer] = await db(query.ADD_PERMISSION_ON_PERM_UPDATE, value, staffId)
        }
    }
}

async function allPermissions({ staffId  }) {
    return await db(query.ALL_PERMISSIONS, staffId)
}

export default {
    getUserPermission,
    addPermission,
    allPermissions
}