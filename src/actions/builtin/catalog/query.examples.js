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
        description: 'Query in catalog',
        example: yaml_1.default.stringify({
            steps: [
                {
                    action: ids_1.CATALOG_QUERY_ID,
                    id: 'query-in-catalog',
                    name: 'Query in catalog',
                    input: {
                        queries: [
                            {
                                limit: 2,
                                fields: [
                                    'metadata.name'
                                ],
                                filter: {
                                    'metadata.annotations.backstage.io/template-origin': 'template:default/java-api',
                                    'relations.dependsOn': '${{ parameters.component_ref }}'
                                }
                            }
                        ]
                    },
                },
            ],
        }),
    },
];
