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
        description: 'Debug read files in log stream',
        example: yaml_1.default.stringify({
            steps: [
                {
                    action: ids_1.DEBUG_FS_READ,
                    id: 'debug-fs-read',
                    name: 'Read files',
                    input: {
                        files: ['./catalog-info.yaml', 'some-file.txt'],
                        useMainLogger: true
                    },
                },
            ],
        }),
    },
];
