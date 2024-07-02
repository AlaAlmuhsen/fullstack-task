"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const postDataValidation = (req, res, next) => {
    (0, express_validator_1.body)('title').trim().isLength({ min: 5 }),
        (0, express_validator_1.body)('content').trim().isLength({ min: 5 });
    next();
};
//# sourceMappingURL=postValidation.js.map