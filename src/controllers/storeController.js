import {GLOBAL} from  '../global/index.js'
import { createStore, getAllStores, getStoreByID } from '../methods/storeMethod.js'

const router = GLOBAL.express?.Router()

router
    .get('/', getAllStores)
    .post('/', createStore)
    .get('/:id', getStoreByID)

export const STORE_ROUTER = {router}