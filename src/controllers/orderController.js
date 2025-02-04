import {GLOBAL} from  '../global/index.js'
import { getSalesOrders, placeOrder, getAllOrderItems, getCurrentSalesOrders, getSavedOrders, getSalesOrdersUnPaid, getBalanceSheet } from '../methods/orderMethod.js'

const router = GLOBAL.express?.Router()

router
    .get('/', getSalesOrders)
    .get('list/all', getAllOrderItems)
    .get('/current', getCurrentSalesOrders)
    .get('/saved', getSavedOrders)
    .get('/unpaid', getSalesOrdersUnPaid)
    .get('/balancesheet/:startDate/:endDate', getBalanceSheet)


    .post('/', placeOrder)


export const ORDER_ROUTER = {router}