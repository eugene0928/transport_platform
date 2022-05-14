const GET_STAFFS = `
    SELECT 
        *
    FROM 
        staffs;
`

const GET_STAFF = `
    SELECT 
        *
    FROM staffs
    WHERE staff_password = crypt($1, staff_password) AND staff_name = $2;
`
const GET_STAFF_WITH_ID = `
    SELECT 
        *
    FROM staffs
    WHERE staff_password = crypt($1, staff_password) OR staff_id = $2;
`

const ADD_STAFF = `
    INSERT INTO 
        staffs(branch_id, staff_name, staff_password, staff_birth_date, staff_gender)
    VALUES
        ($1, $2, crypt($3, gen_salt('bf')), $4, $5)
    RETURNING *;
`
const ADDTRANS_PER = `
    INSERT INTO
        transport_per(staff_id)
    VALUES
        ($1);
`

const ADDBRANCHES_PER = `
    INSERT INTO
        branches_per(staff_id)
    VALUES
        ($1);
`

const ADDPERMISSIONS_PER = `
    INSERT INTO
        permissions_per(staff_id)
    VALUES
        ($1);
`

export default {
    GET_STAFFS,
    GET_STAFF,
    GET_STAFF_WITH_ID,
    ADD_STAFF,
    ADDTRANS_PER,
    ADDBRANCHES_PER,
    ADDPERMISSIONS_PER,
   
}