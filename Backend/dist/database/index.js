"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const db_1 = __importDefault(require("../config/db"));
const post_model_1 = __importDefault(require("../modules/feed/post.model"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
class Database {
    constructor() {
        // @ts-ignore
        let configVariables = db_1.default[`${process.env.ENV}`];
        Database._sequelize = new sequelize_typescript_1.Sequelize({
            database: configVariables.database,
            username: configVariables.username,
            password: configVariables.password,
            host: configVariables.host,
            dialect: configVariables.dialect,
            logging: false
        });
    }
    static get sequelize() {
        return this._sequelize;
    }
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Database._sequelize.authenticate().then(() => {
                console.log("Connected");
            });
        });
    }
    syncTables() {
        return __awaiter(this, void 0, void 0, function* () {
            Database._sequelize.addModels([user_model_1.default, post_model_1.default]);
            // Database._sequelize.addModels([Post])
            yield Database._sequelize.sync({ force: false }).then(() => {
                console.log("synced");
            });
        });
    }
}
exports.default = Database;
//# sourceMappingURL=index.js.map