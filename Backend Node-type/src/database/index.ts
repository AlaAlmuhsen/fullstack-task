import sequelize, {Sequelize} from "sequelize-typescript";
import config from "../config/db";
import {log} from "node:util";
import Post from "../modules/feed/post.model";
import User from "../modules/user/user.model";

class Database {

    private static _sequelize : Sequelize;

    constructor() {
        // @ts-ignore
        let configVariables = config[`${process.env.ENV}`]

        Database._sequelize = new Sequelize(
            {
                database: configVariables.database,
                username: configVariables.username,
                password: configVariables.password,
                host: configVariables.host,
                dialect: configVariables.dialect,
                logging: false
            }
        )
    }

    static get sequelize(): Sequelize {
        return this._sequelize;
    }

    public async testConnection(): Promise<void> {
        await Database._sequelize.authenticate().then(() => {
            console.log("Connected")
        })
    }

    public async syncTables(): Promise<void> {
        Database._sequelize.addModels([User,Post])
        // Database._sequelize.addModels([Post])
        await Database._sequelize.sync({force:false}).then(() => {
            console.log("synced")
        })
    }
}
export default Database