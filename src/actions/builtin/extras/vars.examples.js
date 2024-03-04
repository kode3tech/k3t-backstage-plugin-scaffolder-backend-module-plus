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
        description: 'Proxy vars to reuse on next actions',
        example: yaml_1.default.stringify({
            steps: [
                {
                    action: ids_1.VARS,
                    id: 'reusable-vars',
                    name: 'Proxy vars',
                    input: {
                        foo: 'my-prefixed-${{ parameters.name | lower }}-foo',
                        bar: 'bar-${{ parameters.value | lower }}'
                    },
                },
            ],
        }),
    },
];
