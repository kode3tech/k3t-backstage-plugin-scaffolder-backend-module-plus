import { UrlReader } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { ActionContext, createTemplateAction } from '@backstage/plugin-scaffolder-node';
import decompress from 'decompress';
import { Schema } from 'jsonschema';
import { mkdirSync } from "node:fs";
import path from "node:path";
import { resolvers } from '../../utils/content';
import { ZIP_DECOMPRESS } from './ids';
import { examples } from "./zip-decompress.examples";

export type FieldsType = {
  content: string;
  destination: string;
  encoding?: 'base64' | 'file' | 'url';
  skipErrors?: boolean;
};

export const FieldsSchema: Schema = {
  type: 'object',
  required: ['content', 'destination'],
  properties: {
    content: {
      type: 'string',
      title: 'Zip Content',
      description: 'Zip File Content.',
    },
    destination: {
      type: 'string',
      title: 'Relative path of destination files',
      description: 'Relative path of destination files.',
    },
    encoding: {
      type: 'string',
      title: 'Indicate is encoded "content".',
      // default: 'base64',
      description:
        'Indicate if input "content" field has encoded in "base64", "file" or "url".',
      enum: ['base64', 'file', 'url']
    },
    skipErrors: {
      type: 'boolean',
      title: 'Not Throw on errors.',
      description: 'Not interrupts next actions.',
      // default: false,
    },
  },
}

export const InputSchema: Schema = {
  type: 'object',
  properties: {
    commonParams: FieldsSchema,
    sources: {
      type: 'array',
      items: FieldsSchema
    }
  }
}

export type InputType = {
  commonParams?: Partial<FieldsType>,
  sources: FieldsType[]
}

export type OutputFields = {
  success: boolean;
  files: Array<{
    mode: number;
    mtime: string;
    path: string;
    type: string;
  }>;
  errorMessage?: string;
}


export type OutputType = {
  results: Array<OutputFields>
}

export const OutputSchema: Schema = {
  type: "object",
  properties: {
    results: {
      type: "array",
      items: { 
        type: "object",
        properties: {
          success: {
            title: 'Indicates if OpenApi Spec is valid.',
            type: 'boolean',
          },
          files: {
            type: 'array',
            title: 'List of decompressed files.',
            items: {
              type: 'object',
            },
          },
          errorMessage: {
            title: 'Message if is not valid.',
            type: 'string',
          },
        }        
      },
    }
  }
}

export function createZipDecompressAction({reader, integrations}: {
  reader: UrlReader;
  integrations: ScmIntegrations;
}) {
  
  return createTemplateAction<InputType, OutputType>({
    id: ZIP_DECOMPRESS,
    description: 'Decmpress an zip files from diferent sources types.',
    examples,
    schema: {
      input: InputSchema,
      output: OutputSchema,
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

      const results: Array<OutputFields> = []

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
          logger.error(e?.message);
        }
      }
      
      output('results', results);

    }
  });
}

