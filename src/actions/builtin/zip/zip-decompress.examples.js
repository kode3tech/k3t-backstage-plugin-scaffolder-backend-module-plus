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
        description: 'Decompress multiple files from same encoding type.',
        example: yaml_1.default.stringify({
            steps: [
                {
                    action: ids_1.ZIP_DECOMPRESS,
                    id: 'zip-decompress',
                    name: 'Decompress multiple files.',
                    input: {
                        commonParams: {
                            encoding: 'file',
                        },
                        sources: [
                            { content: './compressed-1.zip', destination: './tmp.zip-1/' },
                            { content: './compressed-2.zip', destination: './tmp.zip-2/' },
                        ]
                    },
                },
            ],
        }),
    },
];
