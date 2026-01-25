import z from 'zod';

export const FieldsSchema = (_: typeof z) => (
  _.object({
    pattern: _.string({
      description: 'Regex expression', 
      message: 'Regex expression to evaluate in file contents from `file`.'
    }),
    glob: _.string({
      description: 'Expression glob to find files to evaluate'
    }),
    replacement: _.string({
      description: 'Replace expression', 
      message: 'Replacement expression based on `pattern` field.'
    }),
    flags: _.string({
      description: 'Regex flags like d, g, i, m, s, u, v or y', 
      message: 'See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags'
    }).optional(),
  })
);

export type FieldsType = z.infer<ReturnType<typeof FieldsSchema>>;
