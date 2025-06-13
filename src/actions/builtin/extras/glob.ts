
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import { Schema } from 'jsonschema';
import { GLOB } from './ids';
import { examples } from "./parse-repo-url.examples";
import globby from 'globby';
import z from 'zod';

export const InputSchema = {
  patterns: z.array(z.string()),
  options: z.object({
    absolute: z.boolean({description: "Return the absolute path for entries."}).optional(),
    baseNameMatch: z.boolean({description: "If set to `true`, then patterns without slashes will be matched against the basename of the path if it contains slashes."}).optional(),
    braceExpansion: z.boolean({description: "Enables Bash-like brace expansion."}).optional(),
    caseSensitiveMatch: z.boolean({description: "Enables a case-sensitive mode for matching files."}).optional(),
    concurrency: z.number({description: "The maximum number of concurrent requests from a reader to read directories. Defaults to the value of `maxParallelism` in the configuration file or 10"}).optional(),
    deep: z.number({description: "The maximum depth for recursive matching. Defaults to the value of `maxDepth` in the configuration file or 10"}).optional(),
    dot: z.boolean({description: "Match dotfiles."}).optional(),
    extglob: z.boolean({description: "Enables Bash-like `extglob` functionality."}).optional(), 
    followSymbolicLinks: z.boolean({description: "Indicates whether to traverse descendants of symbolic link directories."}).optional(),
    globstar: z.boolean({description: "Enables recursively repeats a pattern containing `**`. If `false`, `**` behaves exactly like `*`."}).optional(),
    ignore: z.array(z.string({description: "A list of globs to ignore."})),
    markDirectories: z.boolean({description: "Mark the directory path with the final slash."}).optional(),
    objectMode: z.boolean({description: "Returns objects (instead of strings) describing entries."}).optional(),
    onlyDirectories: z.boolean({description: "Only return directories."}).optional(),
    onlyFiles: z.boolean({description: "Only return files."}).optional(),
    stats: z.boolean({description: "Returns the stats object of each file."}).optional(),
    suppressErrors: z.boolean({description: "Suppresses errors when a file does not exist."}).optional(),
    throwErrorOnBrokenSymbolicLink: z.boolean({description: "Throws an error when a file is broken symbolic link."}).optional(),
    unique: z.boolean({description: "Only return unique files."}).optional(),
    gitignore: z.boolean({description: "Only return files that are not ignored by .gitignore."}).optional(),
  }).optional()
}

export type InputType = {
  patterns: z.infer<typeof InputSchema.patterns>,
  options?: z.infer<typeof InputSchema.options>,
}

export const OutputSchema = {
  results: z.array(z.string()),
}



export function createGlobAction() {

  return createTemplateAction({
    id: GLOB,
    description: 'Read file(s) and display',
    examples,
    schema: {
      input: {
        patterns: (_) => InputSchema.patterns,
        options: (_) => InputSchema.options,
      },
      output: {
        results: (_) => OutputSchema.results
      },
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
