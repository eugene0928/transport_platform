const GET_TRANSPORT = `
    SELECT 
        * 
    FROM
        transports
    WHERE
        branch_id = $1 OR 
        trans_model ILIKE CONCAT('%', $2::varchar, '%')
`

const ADD_TRANSPORT = `
    INSERT INTO
        transports(branch_id, staff_id, trans_model, trans_color, trans_img)
    VALUES 
        ($1, $2, $3, $4, $5)
    RETURNING 
        branch_id, staff_id, trans_id, trans_model, trans_color, trans_img
`

const DELETE_TRANSPORT = `
    DELETE FROM 
        transports
    WHERE 
        branch_id = $1  AND  trans_id = $2
    RETURNING
        trans_id, branch_id, trans_model, trans_color, trans_img

`


export default {
    GET_TRANSPORT,
    ADD_TRANSPORT,
    DELETE_TRANSPORT
}