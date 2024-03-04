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
        description: 'Downloads content and places it in the workspace.',
        example: yaml_1.default.stringify({
            steps: [
                {
                    action: ids_1.FETCH_PLAIN_POLY_ID,
                    id: 'fetch-plain',
                    name: 'Fetch plain',
                    input: {
                        commonParams: {
                            targetPath: './'
                        },
                        sources: [{
                                url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
                            }]
                    },
                },
            ],
        }),
    },
    {
        description: 'Optionally, if you would prefer the data to be downloaded to a subdirectory in the workspace you may specify the ‘targetPath’ input option.',
        example: yaml_1.default.stringify({
            steps: [
                {
                    action: ids_1.FETCH_PLAIN_POLY_ID,
                    id: 'fetch-plain',
                    name: 'Fetch plain',
                    input: {
                        // commonParams: {
                        //   targetPath: './'
                        // },
                        sources: [{
                                url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
                                targetPath: 'fetched-data',
                            }]
                    },
                },
            ],
        }),
    },
];
