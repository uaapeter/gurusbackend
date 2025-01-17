import { GLOBAL } from "../global/index.js"
import { getAllCategories, createCategory, getCategoryByID } from "../methods/categoryMethod.js"

const router = GLOBAL.express?.Router()

router
    .get('/', getAllCategories)
    .post('/', createCategory)
    .get('/:id', getCategoryByID)

export const CATEGORY_ROUTER = {router}