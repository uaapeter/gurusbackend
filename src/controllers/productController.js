import {GLOBAL} from  '../global/index.js'
import { createProduct, getAllProducts, getProductByID, getProductsExpired } from '../methods/productMethod.js'

const router = GLOBAL.express?.Router()

router
    .get('/', getAllProducts)
    .post('/', createProduct)
    .get('/:id', getProductByID)
    .get('/expired/:query', getProductsExpired)

export const PRODUCT_ROUTER = {router}