"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.examples = void 0;
const yaml_1 = __importDefault(require("yaml"));
const ids_1 = require("./ids");
exports.examples = [
    {
        description: 'Generate 3 UUID\'s',
        example: yaml_1.default.stringify({
            steps: [
                {
                    action: ids_1.UUID_V4_GEN,
                    id: 'uuid-v4-gen',
                    name: 'UUID gen',
                    input: {
                        amount: 3
                    },
                },
            ],
        }),
    },
];
