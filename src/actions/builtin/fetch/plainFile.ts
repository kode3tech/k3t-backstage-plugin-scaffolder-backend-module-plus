
import { ScmIntegrations } from '@backstage/integration';
import {
  createTemplateAction,
  fetchFile
} from '@backstage/plugin-scaffolder-node';
import { examples } from './plainFile.examples';
import { FETCH_PLAIN_FILE_ID } from './ids';
import { resolveSafeChildPath, UrlReaderService } from '@backstage/backend-plugin-api';
import { z } from "zod";

export type FieldsType = {
  url: string
  targetPath: string
}


export const FieldsSchema = z.object({
  url: z.string({
    description: 'Fetch URL', 
    message: 'Relative path or absolute URL pointing to the directory tree to fetch.'
  }),
  targetPath: z.string({
    description: 'Target Path',
    message: 'Target path within the working directory to download the contents to.'
  })
});

export const InputSchema = z.object({
  commonParams: FieldsSchema.optional(),
  files: z.array(FieldsSchema)
})

// export type InputType = {
//   commonParams?: Partial<FieldsType>,
//   files: FieldsType[]
// }

// export type OutputType = {
//   results: any[]
// }

export const OutputSchema = z.object({
  results: z.array(z.any())
})

/**
 * Downloads content and places it in the workspace, or optionally
 * in a subdirectory specified by the 'targetPath' input option.
 * @public
 */
export function createFetchPlainFilePlusAction(options: {
  reader: UrlReaderService;
  integrations: ScmIntegrations;
}) {
    const {reader, integrations} = options;

  // const templateAction = createFetchPlainFileAction(options)

  return createTemplateAction({
    id: FETCH_PLAIN_FILE_ID,
    description: 'Downloads single file and places it in the workspace.',
    examples,
    schema: {
      input: {
        commonParams: (d) => d.object(FieldsSchema.shape).optional(),
        files: (d) => d.array(d.object(FieldsSchema.shape))
      },
      output: {
        results: (d) => d.array(d.object({}))
      }
    },
    supportsDryRun: true,
    async handler(ctx) {
      ctx.logger.info('Fetching plain content from remote URL');

      const { 
        input: { 
          files, 
          commonParams
        }, 
        logger, 
        output 
      } = ctx
      
      const results = [];

      for (const file of files) {
        const input = {
          ...{...(commonParams ?? {}), ...file}
        }
        const { url }  = input;
        logger.info(`Fetching template from '${url}'...`)

        const result: Record<string, any> = {}
        ctx.logger.info('Fetching plain content from remote URL');

        // Finally move the template result into the task workspace
        const outputPath = resolveSafeChildPath(
          ctx.workspacePath,
          input.targetPath,
        );

        await fetchFile({
          reader,
          integrations,
          baseUrl: ctx.templateInfo?.baseUrl,
          fetchUrl: input.url,
          outputPath,
          // token: input.token,
        });
        
        // await templateAction.handler({ 
        //     ...ctx, 
        //     output: (k, v) => {result[k] = v},
        //     input: {...input}
        //   })
        results.push(result)
      }
      output('results', results)
    },
  });
}
