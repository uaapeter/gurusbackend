import {GLOBAL} from  '../global/index.js'
import { createLocation, getAllLocation, getLocationByID } from '../methods/locationMethod.js'

const router = GLOBAL.express?.Router()

router
    .get('/', getAllLocation)
    .post('/', createLocation)
    .get('/:id', getLocationByID)

export const LOCATION_ROUTER = {router}