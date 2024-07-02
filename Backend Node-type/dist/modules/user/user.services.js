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
const user_model_1 = __importDefault(require("./user.model"));
const encryption_1 = __importDefault(require("../../util/encryption"));
class UserServices {
    constructor() {
    }
    addUser(email, password, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield encryption_1.default.encryptPassword(password);
            return yield user_model_1.default.create({
                email: email, password: hashedPassword, name: name
            })
                .then((user) => {
                return user;
            })
                .catch(error => {
                throw error;
            });
        });
    }
    findUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findOne({ where: {
                    email: email
                } })
                .then((user) => {
                return user;
            }).catch(error => {
                throw error;
            });
        });
    }
    static findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findOne({ where: {
                    id: id
                } })
                .then((user) => {
                return user;
            }).catch(error => {
                throw error;
            });
        });
    }
    checkPassword(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield encryption_1.default.decryptPassword(password, hash);
        });
    }
}
exports.default = UserServices;
//# sourceMappingURL=user.services.js.map