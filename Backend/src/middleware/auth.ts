import jwt from 'jsonwebtoken'
import {Request, Response, NextFunction} from 'express'


export const isAuth = (req: Request, res: Response, next: NextFunction) => {

    try {

        const authHeader = req.get('Authorization')
        if (!authHeader) {
            const error: any = new Error('Not authenticated.')
            error.statusCode = 401
            throw error
        }

        const token: string = authHeader.split(' ')[1] as string

        if (!token) {
            const error: any = new Error('Not authenticated.')
            error.statusCode = 401
            throw error
        }

        const decodedToken: any = jwt.verify(token, `${process.env.SECRET}`)

        req.body.id = decodedToken?.userId

    } catch (error: any) {
        error.statusCode = error.statusCode || 500
        next(error)
    }
    next()
}
