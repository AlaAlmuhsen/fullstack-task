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
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const router_1 = __importDefault(require("./router"));
const database_1 = __importDefault(require("./database"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const fileUpload_1 = require("./util/fileUpload");
class App {
    // memcached
    constructor() {
        this.express = (0, express_1.default)();
        this.initialiseMiddleware();
    }
    initialiseMiddleware() {
        this.express.use((0, morgan_1.default)("dev"));
        this.express.use(body_parser_1.default.json());
        this.express.use((0, cors_1.default)());
        this.express.use((0, multer_1.default)({ storage: fileUpload_1.fileStorage, fileFilter: fileUpload_1.fileFilter }).single('image'));
        this.express.use('/images', express_1.default.static(path_1.default.join(__dirname, '../', 'images')));
        this.express.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            next();
        });
    }
    initialiseErrorMiddleware() {
        this.express.use((error, req, res, next) => {
            res.status(error.statusCode || 500).json({ message: error.message, data: error.data });
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = new database_1.default();
            yield db.testConnection();
            yield db.syncTables();
            new router_1.default().registerRoutes(this.express);
            this.initialiseErrorMiddleware();
        });
    }
    listen() {
        this.express.listen(process.env.PORT, () => {
            console.log(`App Listen On port ${process.env.PORT}`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map