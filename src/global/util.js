export const tryCatch = (controller) => async (req, res, next) => {
    try {
        await controller(req, res, next)
    } catch (error) {
        next(error)
    }
}

import fs from 'fs'
export const fileUnlink = (path) => {
    fs.unlinkSync(path)

    
}

export const objectToArray = object => {
    const errors = Object.entries(object)
    const data = errors.flatMap(item => item)

    const res = data?.filter(item => item.name == 'ValidatorError')

    const result = res.flatMap(item => {
        return ({
            message: item.message
        })
    })

    return result
}




