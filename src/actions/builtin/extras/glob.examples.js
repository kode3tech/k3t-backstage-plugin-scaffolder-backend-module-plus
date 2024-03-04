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
        description: 'Find files from Glob expressions',
        example: yaml_1.default.stringify({
            steps: [
                {
                    action: ids_1.GLOB,
                    id: 'glob',
                    name: 'List files',
                    input: {
                        patterns: ['**/*.y[a?]ml']
                    },
                },
            ],
        }),
    },
];
