
import { ScmIntegrations } from '@backstage/integration';
import { createTemplateAction, fetchContents } from '@backstage/plugin-scaffolder-node';
import { examples } from './plain.examples';
import { FETCH_PLAIN_POLY_ID } from './ids';
import { resolveSafeChildPath, UrlReaderService } from '@backstage/backend-plugin-api';
import { z } from "zod";

export type FieldsType = {
  url: string
  targetPath: string
}


export const FieldsSchema = {
  url: z.string({
    description: 'Fetch URL', 
    message: 'Relative path or absolute URL pointing to the directory tree to fetch.'
  }),
  targetPath: z.string({
    description: 'Target Path',
    message: 'Target path within the working directory to download the contents to.'
  })
};

export const InputSchema = {
  commonParams: z.object(FieldsSchema).optional(),
  souces: z.array(z.object(FieldsSchema))
}

export const OutputSchema = {
  results: z.array(z.any())
}

/**
 * Downloads content and places it in the workspace, or optionally
 * in a subdirectory specified by the 'targetPath' input option.
 * @public
 */
export function createFetchPlainPlusAction(options: {
  reader: UrlReaderService;
  integrations: ScmIntegrations;
}) {  
  const {reader, integrations} = options;

  return createTemplateAction({
    id: FETCH_PLAIN_POLY_ID,
    description:
    'Downloads content and places it in the workspace, or optionally in a subdirectory specified by the `targetPath` input option.',
    examples,
    schema: {
      input: {
        commonParams: (_) => InputSchema.commonParams,
        sources: (_) => InputSchema.souces
      },
      output: {
        results: (_) => OutputSchema.results
      }
    },
    supportsDryRun: true,
    async handler(ctx) {
      ctx.logger.info('Fetching plain content from remote URL');

      // Finally move the template result into the task workspace
      const { 
        input: { 
          sources, 
          commonParams
        }, 
        output 
      } = ctx
      
      const results = [];

      for (const source of sources) {
        const input = {
          ...{...(commonParams ?? {}), ...source}
        }
        const { url }  = input;
        ctx.logger.info(`Fetching pain from '${url}'...`)

        const result: Record<string, any> = {}
        ctx.logger.info('Fetching plain content from remote URL');

        // Finally move the template result into the task workspace
        const outputPath = resolveSafeChildPath(ctx.workspacePath, input.targetPath ?? './');

        await fetchContents({
          reader,
          integrations,
          baseUrl: ctx.templateInfo?.baseUrl,
          fetchUrl: input.url,
          outputPath,
          // token: input.token,
        });
        results.push(result)
      }
      output('results', results)
    },
  });
}
