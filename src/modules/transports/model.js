import db from '#pg'
import query from './sql.js'

async function getTransport({ branchId, search }) {
    return await db(query.GET_TRANSPORT, branchId, search)
}

async function addNewTransport({ staffid, branchId, model, color, filename }) {
    return await db(query.ADD_TRANSPORT, branchId, staffid, model, color, filename)
}

async function deleteTransport({ branchId, transId }) {
    return await db(query.DELETE_TRANSPORT, branchId, transId)
}

export default {
    getTransport,
    addNewTransport,
    deleteTransport
}