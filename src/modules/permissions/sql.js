const STAFFGET_BRANCH_PER = `
    SELECT 
        staff_id, branch_create, branch_read, branch_delete, branch_update
    FROM 
        branches_per
    WHERE 
        staff_id = $1
`
const GET_STAFF_BRANCH_PER = `
    SELECT 
        *
    FROM
        branches_per
    WHERE
        staff_id = $1
`
const GET_STAFF_TRANS_PER = `
    SELECT 
        *
    FROM
        transport_per
    WHERE
        staff_id = $1
`

const GET_STAFF_PERMS_PER = `
    SELECT
        * 
    FROM
        permissions_per
    WHERE   
        staff_id = $1
`

const ADD_PERMISSION_ON_BRANCH_CREATE = `
    UPDATE   
        branches_per
    SET
        branch_create = $1
    FROM 
        staffs as s
    WHERE
       branches_per.staff_id = $2
`

const ADD_PERMISSION_ON_BRANCH_READ = `
    UPDATE   
        branches_per
    SET
        branch_read = $1
    FROM 
        staffs as s
    WHERE
       branches_per.staff_id = $2
`
const ADD_PERMISSION_ON_BRANCH_DELETE = `
    UPDATE   
        branches_per
    SET
        branch_delete = $1
    FROM 
        staffs as s
    WHERE
       branches_per.staff_id = $2
`
const ADD_PERMISSION_ON_BRANCH_UPDATE = `
    UPDATE   
        branches_per
    SET
        branch_update = $1
    FROM 
        staffs as s
    WHERE
       branches_per.staff_id = $2
`

const ADD_PERMISSION_ON_TRANS_CREATE = `
    UPDATE   
        transport_per
    SET
        trans_create = $1
    WHERE
       transport_per.staff_id = $2
`

const ADD_PERMISSION_ON_TRANS_READ = `
    UPDATE   
        transport_per
    SET
        trans_read = $1
    WHERE
       transport_per.staff_id = $2
`
const ADD_PERMISSION_ON_TRANS_DELETE = `
    UPDATE   
        transport_per
    SET
        trans_delete = $1
    WHERE
       transport_per.staff_id = $2
`

const ADD_PERMISSION_ON_TRANS_UPDATE = `
    UPDATE   
        transport_per
    SET
        trans_update = $1
    WHERE
       transport_per.staff_id = $2
`

const ADD_PERMISSION_ON_PERM_CREATE = `
    UPDATE   
        permissions_per
    SET
        per_create = $1
    WHERE
       permissions_per.staff_id = $2
`

const ADD_PERMISSION_ON_PERM_READ = `
    UPDATE   
        permissions_per
    SET
        per_read = $1
    WHERE
       permissions_per.staff_id = $2
`
const ADD_PERMISSION_ON_PERM_DELETE = `
    UPDATE   
        permissions_per
    SET
        per_delete = $1
    WHERE
       permissions_per.staff_id = $2
`

const ADD_PERMISSION_ON_PERM_UPDATE = `
    UPDATE   
        permissions_per
    SET
        per_update = $1
    WHERE
       permissions_per.staff_id = $2
`

const ALL_PERMISSIONS = `
    SELECT 
        s.staff_id, s.staff_name, b.branch_create, b.branch_read, b.branch_delete, b.branch_update,
        t.trans_create, t.trans_read, t.trans_delete, t.trans_update,
        p.per_create, p.per_read, p.per_delete, p.per_update
    FROM 
        staffs as s
    JOIN 
        branches_per as b ON b.staff_id = s.staff_id 
    JOIN 
        transport_per as t ON t.staff_id = s.staff_id
    JOIN 
        permissions_per as p ON p.staff_id = s.staff_id
    WHERE 
        s.staff_id = $1
`

export default {
    STAFFGET_BRANCH_PER,
    GET_STAFF_BRANCH_PER,
    GET_STAFF_TRANS_PER,
    GET_STAFF_PERMS_PER,
    ADD_PERMISSION_ON_BRANCH_CREATE,
    ADD_PERMISSION_ON_BRANCH_READ,
    ADD_PERMISSION_ON_BRANCH_DELETE,
    ADD_PERMISSION_ON_BRANCH_UPDATE,
    ADD_PERMISSION_ON_PERM_UPDATE,
    ADD_PERMISSION_ON_PERM_DELETE,
    ADD_PERMISSION_ON_PERM_READ,
    ADD_PERMISSION_ON_PERM_CREATE,
    ADD_PERMISSION_ON_TRANS_UPDATE,
    ADD_PERMISSION_ON_TRANS_DELETE,
    ADD_PERMISSION_ON_TRANS_READ,
    ADD_PERMISSION_ON_TRANS_CREATE,
    ALL_PERMISSIONS
}