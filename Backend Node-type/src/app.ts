import Express, {Application,NextFunction, Request, Response} from "express";
import morgan from 'morgan'
import bodyParser from "body-parser";
import Router from "./router";
import Database from "./database";
import path from 'path'
import multer from "multer";
import cors from "cors";
import {
    fileStorage, fileFilter
} from "./util/fileUpload";



class App {
    public express: Application
    // memcached

    constructor() {
        this.express = Express()
        this.initialiseMiddleware()
    }

    private initialiseMiddleware(): void {
        this.express.use(morgan("dev"))
        this.express.use(bodyParser.json())
        this.express.use(cors())
        this.express.use(multer({storage: fileStorage, fileFilter : fileFilter}).single('image'))
        this.express.use('/images', Express.static(path.join(__dirname,'../','images')))
        this.express.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Methods', '*')
            res.setHeader('Access-Control-Allow-Headers', '*')
            next()
        })
    }

    private initialiseErrorMiddleware() : void {
        this.express.use((error : any,  req : Request,res : Response,next: NextFunction) => {

            res.status(error.statusCode || 500).json({message:error.message, data : error.data})
        })
    }

    public async init() {
        const db : Database = new Database()
        await db.testConnection()
        await db.syncTables()
        new Router().registerRoutes(this.express)
        this.initialiseErrorMiddleware()

    }


    public listen(): void {
        this.express.listen(process.env.PORT, () => {
            console.log(`App Listen On port ${process.env.PORT}`)
        })
    }

}

export default App