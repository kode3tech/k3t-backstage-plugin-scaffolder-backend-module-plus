import { HostDiscovery } from '@backstage/backend-defaults/discovery';
import { coreServices, createBackendModule } from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';

import {
  createCatalogQueryAction,
  createCatalogRegisterPlusAction,
  createCatalogRelationAction,
  createDebugFsReadAction,
  createFetchPlainAction,
  createFetchPlainFilePlusAction,
  createFetchTemplatePlusAction,
  createFilesystemRenamePlusAction,
  createGlobAction,
  createParseRepoUrlAction,
  createRegexFsReplaceAction,
  createUuidV4GenAction,
  createVarsAction
} from './actions/builtin';

import { CatalogClient } from '@backstage/catalog-client';
import {
  ScmIntegrations,
} from '@backstage/integration';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';


/**
 * A backend module that registers the action into the scaffolder
 */
export const scaffolderCatalogModule = createBackendModule({
  moduleId: 'k3tech.scaffolder-actions-plus',
  pluginId: 'scaffolder',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolderActions: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
        reader: coreServices.urlReader
      },
      async init({ scaffolderActions, config, reader}) {
        const discoveryApi = HostDiscovery.fromConfig(config);
        const catalogClient = new CatalogClient({ discoveryApi });
        const integrations = ScmIntegrations.fromConfig(config);
      
        scaffolderActions.addActions(
          createCatalogQueryAction({catalogClient}),
          createGlobAction(),
          createVarsAction(),
          createCatalogRegisterPlusAction({catalog: catalogServiceRef.T, integrations}),
          createCatalogRelationAction({discoveryApi}),
          createDebugFsReadAction(),
          createUuidV4GenAction(),
          createFetchPlainAction({integrations, reader}),
          createFetchPlainFilePlusAction({integrations, reader}),
          createFetchTemplatePlusAction({integrations, reader}),
          createFilesystemRenamePlusAction(),
          createParseRepoUrlAction({integrations}),
          createRegexFsReplaceAction(),
        );
      }
    });
  },
})
