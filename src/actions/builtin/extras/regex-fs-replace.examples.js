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
        description: 'Replace in files using Regex and Glob',
        example: yaml_1.default.stringify({
            steps: [
                {
                    action: ids_1.REGEX_FS_REPLACE,
                    id: 'regex-fs-replace',
                    name: 'Replace in files',
                    input: {
                        glob: '**/*.y[a?]ml',
                        pattern: 'a',
                        replacement: 'b',
                        flags: 'g'
                    },
                },
            ],
        }),
    },
    {
        description: 'Replace on xml keeping original indentarion useful to Yaml, Json and XML formats.',
        example: yaml_1.default.stringify({
            steps: [
                {
                    action: ids_1.REGEX_FS_REPLACE,
                    id: 'regex-fs-replace',
                    name: 'Append spring-kafka',
                    input: {
                        pattern: '([\\t ]+)<\/dependencies>',
                        glob: 'pom.xml',
                        replacement: [
                            "$1	<dependency>",
                            "$1		<!-- added from backstage -->",
                            "$1		<groupId>org.springframework.kafka</groupId>",
                            "$1		<artifactId>spring-kafka</artifactId>",
                            "$1	</dependency>",
                            "$1</dependencies>",
                        ].join('\n')
                    },
                },
            ],
        }),
    },
];
