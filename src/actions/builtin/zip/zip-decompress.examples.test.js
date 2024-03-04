"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('@backstage/plugin-scaffolder-node', () => {
    const actual = jest.requireActual('@backstage/plugin-scaffolder-node');
    return Object.assign(Object.assign({}, actual), { fetchFile: jest.fn() });
});
const yaml_1 = __importDefault(require("yaml"));
const os_1 = __importDefault(require("os"));
const backend_common_1 = require("@backstage/backend-common");
const config_1 = require("@backstage/config");
const integration_1 = require("@backstage/integration");
const zip_decompress_1 = require("./zip-decompress");
const stream_1 = require("stream");
const zip_decompress_examples_1 = require("./zip-decompress.examples");
const ids_1 = require("./ids");
describe(`${ids_1.ZIP_DECOMPRESS} examples`, () => {
    const integrations = integration_1.ScmIntegrations.fromConfig(new config_1.ConfigReader({
        integrations: {
            github: [{ host: 'github.com', token: 'token' }],
        },
    }));
    const reader = {
        readUrl: jest.fn(),
        readTree: jest.fn(),
        search: jest.fn(),
    };
    beforeEach(() => {
        jest.resetAllMocks();
    });
    const action = (0, zip_decompress_1.createZipDecompressAction)({ integrations, reader });
    const mockContext = {
        workspacePath: os_1.default.tmpdir(),
        logger: (0, backend_common_1.getVoidLogger)(),
        logStream: new stream_1.PassThrough(),
        output: jest.fn(),
        createTemporaryDirectory: jest.fn(),
    };
    it('should parse object', () => __awaiter(void 0, void 0, void 0, function* () {
        const parsedExemple = yaml_1.default.parse(zip_decompress_examples_1.examples[0].example);
        yield action.handler(Object.assign(Object.assign({}, mockContext), { input: parsedExemple.steps[0].input }));
        const result = [
            [yaml_1.default.parse(parsedExemple.steps[0].input.sources[0].content)],
            [yaml_1.default.parse(parsedExemple.steps[0].input.sources[1].content)]
        ];
        expect(mockContext.output).toHaveBeenCalledWith('results', result);
    }));
});
