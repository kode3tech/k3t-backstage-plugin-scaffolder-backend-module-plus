
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import { Schema } from 'jsonschema';
import { GLOB } from './ids';
import { examples } from "./parse-repo-url.examples";
import globby from 'globby';

export type FieldsType = {
  patterns: string[],
  options?: {
    absolute?: boolean
    baseNameMatch?: boolean
    braceExpansion?: boolean
    caseSensitiveMatch?: boolean
    concurrency?: number
    deep?: number
    dot?: boolean
    extglob?: boolean
    followSymbolicLinks?: boolean
    globstar?: boolean
    ignore?: string[]
    markDirectories?: boolean
    objectMode?: boolean
    onlyDirectories?: boolean
    onlyFiles?: boolean
    stats?: boolean
    suppressErrors?: boolean
    throwErrorOnBrokenSymbolicLink?: boolean
    unique?: boolean
    gitignore?: boolean
  }
} & JsonObject;

export const FieldsSchema: Schema = {
  type: 'object',
  required: ['patterns'],
  properties: {
    patterns: {
      title: 'List of glob patterns to match files',
      description: 'List of glob patterns to match files. See https://github.com/mrmlnc/fast-glob#pattern-syntax to details.',
      type: 'array',
      items: {
        type: 'string'
      }
    },
    options: {
      type: 'object',
      description: 'See https://github.com/mrmlnc/fast-glob#common-options for details.',
      properties: {
        absolute: {
          type: "boolean",
          title: "Return the absolute path for entries.",
          // default: false,
        },
        baseNameMatch: {
          type: "boolean",
          title: "If set to `true`, then patterns without slashes will be matched against the basename of the path if it contains slashes.",
          // default: false,
        },
        braceExpansion: {
          type: "boolean",
          title: "Enables Bash-like brace expansion.",
          // default: true,
        },
        caseSensitiveMatch: {
          type: "boolean",
          title: "Enables a case-sensitive mode for matching files.",
          // default: true,
        },
        concurrency: {
          type: "number",
          title: "Specifies the maximum number of concurrent requests from a reader to read directories.",
          // default: "os.cpus().length",
        },
        deep: {
          type: "number",
          title: "Specifies the maximum depth of a read directory relative to the start directory.",
          // default: "Infinity",
        },
        dot: {
          type: "boolean",
          title: "Allow patterns to match entries that begin with a period (`.`).",
          // default: false,
        },
        extglob: {
          type: "boolean",
          title: "Enables Bash-like `extglob` functionality.",
          // default: true,
        },
        followSymbolicLinks: {
          type: "boolean",
          title: "Indicates whether to traverse descendants of symbolic link directories.",
          // default: true,
        },
        globstar: {
          type: "boolean",
          title: "Enables recursively repeats a pattern containing `**`. If `false`, `**` behaves exactly like `*`.",
          // default: true,
        },
        ignore: {
          type: "array",
          title: "An array of glob patterns to exclude matches. This is an alternative way to use negative patterns.",
          // default: [],
          items: {
            type: "string"
          },
        },
        markDirectories: {
          type: "boolean",
          title: "Mark the directory path with the final slash.",
          // default: false,
        },
        objectMode: {
          type: "boolean",
          title: "Returns objects (instead of strings) describing entries.",
          // default: false,
        },
        onlyDirectories: {
          type: "boolean",
          title: "Return only directories.",
          // default: false,
        },
        onlyFiles: {
          type: "boolean",
          title: "Return only files.",
          // default: true,
        },
        stats: {
          type: "boolean",
          title: "Enables an object mode (`objectMode`) with an additional `stats` field.",
          // default: false,
        },
        suppressErrors: {
          type: "boolean",
          title: "By default this package suppress only `ENOENT` errors. Set to `true` to suppress any error.",
          // default: false,
        },
        throwErrorOnBrokenSymbolicLink: {
          type: "boolean",
          title: "Throw an error when symbolic link is broken if `true` or safely return `lstat` call if `false`.",
          // default: false,
        },
        unique: {
          type: "boolean",
          title: "Ensures that the returned entries are unique.",
          // default: true,
        },
        gitignore: {
          type: "boolean",
          title: "Respect ignore patterns in `.gitignore` files that apply to the globbed files.",
          // default: false,
        },
      }
    }
  },
}


export const InputSchema: Schema = FieldsSchema

export type InputType = FieldsType

export type OutputFields = string

export type OutputType = {
  results: Array<OutputFields>
}


export const OutputSchema: Schema = {
  type: "object",
  properties: {
    results: {
      type: "array",
      items: { 
        type: "string"
      },
    }
  }
}



export function createGlobAction() {

  return createTemplateAction<InputType, OutputType>({
    id: GLOB,
    description: 'Read file(s) and display',
    examples,
    schema: {
      input: InputSchema,
      output: OutputSchema,
    },

    async handler(ctx) {
      ctx.logger.info('Glob');

      const {
        input: { patterns, options },
        output
      } = ctx;
      const p = [...patterns]
      try {
        const files = globby.sync(p, {
          ...(options ?? {}), 
          cwd: ctx.workspacePath
        })        
        output('results', files)
      } catch (error) {
        output('results', [])
      }
    }
  });
}
