import { UrlReaderService } from "@backstage/backend-plugin-api";
import { ScmIntegrations } from "@backstage/integration";
import { ActionContext, fetchFile } from "@backstage/plugin-scaffolder-node";
import { readFileSync, rmSync } from "node:fs";
import { resolve as resolvePath } from "node:path";


export type ContentType = 'base64' | 'file' | 'raw' | 'url';

export const AvailableTypes = ['base64', 'file', 'raw', 'url'];

type fnContentResolver = (content: string, ctx: ActionContext<any, any>, env: {
  reader: UrlReaderService;
  integrations: ScmIntegrations;
}) => Promise<string> | string;

export const resolvers: Record<ContentType, fnContentResolver> = {
  'raw': (content) => content,
  'base64': ( content )=> Buffer.from(content.split(';')[2].split(',')[1], 'base64').toString(),
  'file': (content, {workspacePath}) => readFileSync(resolvePath(workspacePath, content)).toString('utf8'),
  'url': async (content, {workspacePath, templateInfo}, {reader, integrations}) => {
    const tmpFetchFile = resolvePath(workspacePath, './tmp.fetchFile');

    await fetchFile({
      reader,
      integrations,
      baseUrl: templateInfo?.baseUrl ?? workspacePath,
      fetchUrl: content,
      outputPath: tmpFetchFile,
    });

    // logger.error('Parsing Json from url has not implemented yet!')
    const finalContent = readFileSync(tmpFetchFile).toString('utf8');
    rmSync(tmpFetchFile);
    return finalContent;
  }
}
