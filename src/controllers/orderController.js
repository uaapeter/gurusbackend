import {GLOBAL} from  '../global/index.js'
import { getSalesOrders, placeOrder, getAllOrderItems, getCurrentSalesOrders, getSavedOrders } from '../methods/orderMethod.js'

const router = GLOBAL.express?.Router()

router
    .get('/', getSalesOrders)
    .get('list/all', getAllOrderItems)
    .get('/current', getCurrentSalesOrders)
    .get('/saved', getSavedOrders)

    .post('/', placeOrder)


export const ORDER_ROUTER = {router}