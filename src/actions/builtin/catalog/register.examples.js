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
        description: 'Register with the catalog',
        example: yaml_1.default.stringify({
            steps: [
                {
                    action: ids_1.CATALOG_REGISTER_ID,
                    id: 'register-with-catalog',
                    name: 'Register with the catalog',
                    input: {
                        infos: [{
                                catalogInfoUrl: 'http://github.com/backstage/backstage/blob/master/catalog-info.yaml',
                            }]
                    },
                },
            ],
        }),
    },
    {
        description: 'Register with the catalog',
        example: yaml_1.default.stringify({
            steps: [
                {
                    action: ids_1.CATALOG_REGISTER_ID,
                    id: 'register-with-catalog',
                    name: 'Register with the catalog',
                    input: {
                        commonParams: {
                            optional: true
                        },
                        infos: [
                            { catalogInfoUrl: 'http://github.com/backstage/backstage/blob/master/catalog-info.yaml', optional: false },
                            { catalogInfoUrl: 'http://github.com/backstage/backstage/blob/master/catalog-info-two.yaml' }
                        ]
                    },
                },
            ],
        }),
    },
];
