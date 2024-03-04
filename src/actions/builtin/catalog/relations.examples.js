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
        description: 'Query in relations',
        example: yaml_1.default.stringify({
            steps: [
                {
                    action: ids_1.CATALOG_RELATIONS_ID,
                    id: 'query-in-relations',
                    name: 'Query in relations',
                    input: {
                        queries: [
                            {
                                relations: [{
                                        type: "apiProvidedBy",
                                        targetRef: "component/default:customers-service"
                                    }, {
                                        type: "ownedBy",
                                        targetRef: "group/default:dream-devs"
                                    }],
                                optional: true,
                                relationType: "apiProvidedBy"
                            }
                        ]
                    },
                },
            ],
        }),
    },
];
