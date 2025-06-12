import { ScmIntegrations } from '@backstage/integration';
import { ActionContext, createTemplateAction } from '@backstage/plugin-scaffolder-node';
import decompress from 'decompress';
import { mkdirSync } from "node:fs";
import path from "node:path";
import { resolvers } from '../../utils/content';
import { ZIP_DECOMPRESS } from './ids';
import { examples } from "./zip-decompress.examples";
import { UrlReaderService } from '@backstage/backend-plugin-api';
import z from 'zod';


export const FieldsSchema = z.object({
  content: z.string({
    description: 'Zip Content',
    message: 'Zip File Content.'
  }).optional(),
  destination: z.string({
    description: 'Relative path of destination files',
    message: 'Relative path of destination files.'
  }).optional(),
  encoding: z.enum(['base64', 'file', 'url'], {
    description: 'Indicate is encoded "content".',
    message: 'Indicate if input "content" field has encoded in "base64", "file" or "url".'
  }).default('file').optional(),
  skipErrors: z.boolean({
    description: 'Not Throw on errors.',
    message: 'Not interrupts next actions.',
  }).default(true).optional(),
})

export type FieldsType = z.infer<typeof FieldsSchema>;

export const InputSchema = z.object({
  commonParams: FieldsSchema.optional(),
  sources: z.array(FieldsSchema)
});

export const OutputSchema = z.object({
  success: z.boolean({
    description: 'Indicates if OpenApi Spec is valid.',
  }),
  files: z.array(
    z.object({
      mode: z.number(),
      mtime: z.string(),
      path: z.string(),
      type: z.string(),
    }), 
    { description: 'List of decompressed files.' }
  ),
  errorMessage: z.string({
    description: 'Message if is not valid.'
  }).optional(),
});

export function createZipDecompressAction({reader, integrations}: {
  reader: UrlReaderService;
  integrations: ScmIntegrations;
}) {
  
  return createTemplateAction({
    id: ZIP_DECOMPRESS,
    description: 'Decmpress an zip files from diferent sources types.',
    examples,
    schema: {
      input: {
        commonParams: (d) => d.object(FieldsSchema.shape).optional(),
        sources: (d) => d.array(d.object(FieldsSchema.shape))
      },
      output: {
        results: (d) => d.array(d.object(OutputSchema.shape))
      }
    },
    async handler(ctx) {

      const { 
        input: { 
          sources,
          commonParams
        },
        logger,
        output,
        workspacePath
      } = ctx;

      const results: Array<z.infer<typeof OutputSchema>> = []

      for (const source of sources) {
        const { 
          content, 
          encoding = 'base64', 
          destination
        } =  {
          ...(commonParams ?? {}), 
          ...source
        }
        
        try {
          if(!content) throw new Error('Content is required, fill on "commonParams.content" or "sources[].content".');
          if(!destination) throw new Error('Destination is required, fill on "commonParams.destination" or "sources[].destination".');
          
          const finalContent = await resolvers[encoding](
            content, ctx as ActionContext<any, any>, 
            {reader, integrations}
          );
          
          const destinationPath = path.resolve(workspacePath, destination)
        
          mkdirSync(destinationPath, {recursive: true})
  
          logger.info(`destination path: ${destinationPath}`)
          const entities = await decompress( Buffer.from(finalContent), destinationPath);
          
          results.push({
            success: true,
            files: entities.map(({ path: p, mode, type, mtime}) => {
              return {path: p, mode, type, mtime}
            })
          });
        } catch (e: any) {
          results.push({success: false, files: [], errorMessage: e?.message || e});
          // logger.pipe(mainLogger)
          if(logger.error) logger.error(e?.message);
        }
      }
      
      output('results', results);

    }
  });
}

