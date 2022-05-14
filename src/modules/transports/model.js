import db from '#pg'
import query from './sql.js'

async function getTransport({ branchId, search }) {
    return await db(query.GET_TRANSPORT, branchId, search)
}

async function addTransport({ staffid, branchId, model, color, filePath }) {
    return await db(query.ADD_TRANSPORT, branchId, staffid, model, color, filePath)
}

export default {
    getTransport
}