
import { ScmIntegrations } from '@backstage/integration';
import { createTemplateAction, fetchFile } from '@backstage/plugin-scaffolder-node';
import { examples } from './template.examples';
import { FETCH_TEMPLATE_ID } from './ids';
import { resolveSafeChildPath, UrlReaderService } from '@backstage/backend-plugin-api';
import { z } from "zod";

export type FieldsType = {
  url: string
  targetPath: string
  values: any
  copyWithoutRender: string[]
  copyWithoutTemplating: string[]
  cookiecutterCompat: boolean
  templateFileExtension: string | boolean
  replace: boolean
}

export const FieldsSchema = z.object({
  url: z.string({
    description: 'Fetch URL', 
    message: 'Relative path or absolute URL pointing to the directory tree to fetch.'
  }),
  targetPath: z.string({
    description: 'Target Path',
    message: 'Target path within the working directory to download the contents to.'
  }),
  values: z.object({}, {
    description: 'Template Values',
    message: 'Values to pass on to the templating engine'
  }),
  copyWithoutRender: z.array(
    z.string({
      description: '[Deprecated] Copy Without Render',
      message: 'An array of glob patterns. Any files or directories which match are copied without being processed as templates.'
    })
  ).optional(),
  copyWithoutTemplating: z.array(
    z.string({
      description: 'Copy Without Templating',
      message: 'An array of glob patterns. Contents of matched files or directories are copied without being processed, but paths are subject to rendering.'
    })
  ).optional(),
  cookiecutterCompat: z.boolean({
    description: 'Cookiecutter compatibility mode',
    message: 'Enable features to maximise compatibility with templates built for fetch:cookiecutter'
  }).optional(),
  templateFileExtension: z.string({
    description: 'Template File Extension',
    message: 'Target path within the working directory to download the contents to.'
  }).optional(),
  replace: z.boolean({
    description: 'Replace files',
    message: 'If set, replace files in targetPath instead of skipping existing ones.'
  }).optional(),
});

export const InputSchema = z.object({
  commonParams: FieldsSchema.optional(),
  templates: z.array(FieldsSchema)
});

export const OutputSchema = z.object({
  results: z.array(z.any())
});

export function createFetchTemplatePlusAction(options: {
  integrations: ScmIntegrations,
  reader: UrlReaderService
}) {
  const {reader, integrations} = options;

  return createTemplateAction({
    id: FETCH_TEMPLATE_ID,
    description: "Same from 'fetch:template' for array list.",
    examples,
    schema: {
      input: {
        commonParams: (d) => d.object(FieldsSchema.shape).optional(),
        templates: (d) => d.array(d.object(FieldsSchema.shape))
      },
      output: {
        results: (d) => d.array(d.object({}))
      }
    },
    async handler(ctx) {
      const { 
        input: { 
          templates, 
          commonParams
        }, 
        output 
      } = ctx
      
      const results = [];

      for (const value of templates) {
        const input = {
          ...{...(commonParams ?? {}), ...value}
        }
        const { url }  = input;
        ctx.logger.info(`Fetching template from '${url}'...`)

        const result: Record<string, any> = {}
        ctx.logger.info('Fetching plain content from remote URL');

        // Finally move the template result into the task workspace
        const outputPath = resolveSafeChildPath(ctx.workspacePath, input.targetPath ?? './');

        await fetchFile({
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
