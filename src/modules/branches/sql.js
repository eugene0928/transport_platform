const GET_BRANCHES = `
    SELECT 
        * 
    FROM 
        branches;
`

const ADD_NEW_BRANCH = `
    INSERT INTO
        branches(branch_name, branch_address)
    VALUES
        ($1, $2)
    RETURNING branch_id, branch_name, branch_address

`

const DELETE_BRANCH = `
    DELETE FROM 
        branches
    WHERE 
        branch_id = $1
    RETURNING 
        branch_id, branch_name, branch_address

`

export default {
    GET_BRANCHES,
    ADD_NEW_BRANCH,
    DELETE_BRANCH
}