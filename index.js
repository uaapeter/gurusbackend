import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { GLOBAL } from './src/global/index.js'
import { databaseConnection } from './connection.js'
import { STORE_ROUTER } from './src/controllers/storeController.js'
import { STAFF_ROUTER } from './src/controllers/staffController.js'
import { LOCATION_ROUTER } from './src/controllers/locationController.js'
import { ErrorHandler } from './src/global/errorHandler.js'
import { SUPPLIER_ROUTER } from './src/controllers/supplierController.js'
import { requireToken } from './src/middleWare/index.js'
import { CATEGORY_ROUTER } from './src/controllers/categoryController.js'
import { PRODUCT_ROUTER } from './src/controllers/productController.js'
import { ORDER_ROUTER } from './src/controllers/orderController.js'
import { DISCOUNT_ROUTER } from './src/controllers/discountController.js'
import { CHARGE_ROUTER } from './src/controllers/chargeController.js'

const appServer = async () => {
    dotenv.config()
    const app = GLOBAL.express()
    const PORT = 8000
    app.use(cors())
    app.use(GLOBAL.express.json())
    const __dirname = path.resolve()

    await databaseConnection()

    app.listen( PORT,() => {
        console.table(`API Listening on Port ${PORT}`)
    })

    const staticDir = path.join(__dirname+'/public/static')
    app.use(GLOBAL.express.static(path.join(__dirname, 'out')))


    app.use('/api/v1/store', requireToken, STORE_ROUTER.router)
    app.use('/api/v1/user', STAFF_ROUTER.router)
    app.use('/api/v1/order', requireToken, ORDER_ROUTER.router)
    app.use('/api/v1/location', LOCATION_ROUTER.router)
    app.use('/api/v1/supplier', requireToken, SUPPLIER_ROUTER.router)
    app.use('/api/v1/category', requireToken, CATEGORY_ROUTER.router)
    app.use('/api/v1/product', requireToken, PRODUCT_ROUTER.router)
    app.use('/api/v1/discount', requireToken, DISCOUNT_ROUTER.router)
    app.use('/api/v1/charges', requireToken, CHARGE_ROUTER.router)

    app.get('/v1/about', (req, res) => {
        res.send('This is my about route....')
    })


    app.use('/public/static', GLOBAL.express.static(staticDir))

    app.use(ErrorHandler)

}


appServer()