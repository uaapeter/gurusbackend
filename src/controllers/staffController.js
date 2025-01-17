import {GLOBAL} from  '../global/index.js'
import { createUser, getUsers, getUserByID, handleUserLogIn, authenticatedUser, changePassword } from '../methods/staffMethod.js'
import { requireToken } from '../middleWare/index.js'

const router = GLOBAL.express?.Router()

router
    .get('/', getUsers)
    .get('/auth', requireToken, authenticatedUser)
    .get('/:id', getUserByID)
    .post('/', createUser)
    .put('/password', requireToken, changePassword)
    .post('/login', handleUserLogIn)



export const STAFF_ROUTER = {router}