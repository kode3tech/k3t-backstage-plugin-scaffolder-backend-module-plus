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
const stream_1 = require("stream");
const os_1 = __importDefault(require("os"));
const backend_common_1 = require("@backstage/backend-common");
const config_1 = require("@backstage/config");
const integration_1 = require("@backstage/integration");
const register_1 = require("./register");
const register_examples_1 = require("./register.examples");
const yaml_1 = __importDefault(require("yaml"));
const ids_1 = require("./ids");
describe(`${ids_1.CATALOG_REGISTER_ID} examples`, () => {
    const integrations = integration_1.ScmIntegrations.fromConfig(new config_1.ConfigReader({
        integrations: {
            github: [{ host: 'github.com', token: 'token' }],
        },
    }));
    const addLocation = jest.fn();
    const catalogClient = {
        addLocation: addLocation,
    };
    const action = (0, register_1.createCatalogRegisterPlusAction)({
        integrations,
        catalogClient: catalogClient,
    });
    const mockContext = {
        workspacePath: os_1.default.tmpdir(),
        logger: (0, backend_common_1.getVoidLogger)(),
        logStream: new stream_1.PassThrough(),
        output: jest.fn(),
        createTemporaryDirectory: jest.fn(),
    };
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('should register location in catalog', () => __awaiter(void 0, void 0, void 0, function* () {
        addLocation
            .mockResolvedValueOnce({
            entities: [],
        })
            .mockResolvedValueOnce({
            entities: [
                {
                    metadata: {
                        namespace: 'default',
                        name: 'test',
                    },
                    kind: 'Component',
                },
            ],
        });
        yield action.handler(Object.assign(Object.assign({}, mockContext), { input: yaml_1.default.parse(register_examples_1.examples[0].example).steps[0].input }));
        expect(addLocation).toHaveBeenNthCalledWith(1, {
            type: 'url',
            target: 'http://github.com/backstage/backstage/blob/master/catalog-info.yaml',
        }, {});
        expect(addLocation).toHaveBeenNthCalledWith(2, {
            dryRun: true,
            type: 'url',
            target: 'http://github.com/backstage/backstage/blob/master/catalog-info.yaml',
        }, {});
        expect(mockContext.output).toHaveBeenCalledWith('entityRef', 'component:default/test');
        expect(mockContext.output).toHaveBeenCalledWith('catalogInfoUrl', 'http://github.com/backstage/backstage/blob/master/catalog-info.yaml');
    }));
});
