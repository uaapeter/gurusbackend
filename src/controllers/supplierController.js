import {GLOBAL} from  '../global/index.js'
import { createSupplier, getAllSuppliers, getSupplierByID } from '../methods/supplierMethod.js'

const router = GLOBAL.express?.Router()

router
    .get('/', getAllSuppliers)
    .post('/', createSupplier)
    .get('/:id', getSupplierByID)

export const SUPPLIER_ROUTER = {router}