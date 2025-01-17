import { GLOBAL } from "../global/index.js"
import { getAllDiscount, createDiscount, getDiscountByID } from "../methods/discountMethod.js"

const router = GLOBAL.express?.Router()

router
    .get('/', getAllDiscount)
    .post('/', createDiscount)
    .get('/:id', getDiscountByID)

export const DISCOUNT_ROUTER = {router}