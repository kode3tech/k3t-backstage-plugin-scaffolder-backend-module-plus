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
        description: 'Parse Repo Url like "host?owner=any&organization=any&workspace=any&project=any"',
        example: yaml_1.default.stringify({
            steps: [
                {
                    action: ids_1.PARSE_REPO_URL,
                    id: 'parse-repos-url',
                    name: 'Parse Repos URLs',
                    input: {
                        reposUrls: ['host?owner=any&organization=any&workspace=any&project=any']
                    },
                },
            ],
        }),
    },
];
