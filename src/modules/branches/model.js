import { ValidationError } from 'apollo-server-express'
import db from '#pg'
import query from './sql.js'

async function getBranches({ pass }) {
    if(pass == 'super')
        return await db(query.GET_BRANCHES)
    else
        throw new ValidationError('You have not permission to see all branches!')

}

async function addNewBranch({ branchName, branchAddress }) {
    return await db(query.ADD_NEW_BRANCH, branchName, branchAddress)
}

async function deleteBranch({ branchId }) {
    return await db(query.DELETE_BRANCH, branchId)
}

export default {
    getBranches,
    addNewBranch,
    deleteBranch,
}