import { GLOBAL } from "../global/index.js"
import { getAllCharges, createCharge, getChargeByID } from "../methods/chargeMethod.js"

const router = GLOBAL.express?.Router()

router
    .get('/', getAllCharges)
    .post('/', createCharge)
    .get('/:id', getChargeByID)

export const CHARGE_ROUTER = {router}