import z from 'zod';

export const FieldsSchema = (_: typeof z) => (
  _.object({
    glob: z.string({ 
      description: 'glob expression to find files and folders'
    }),
    pattern: z.string({ 
      description: 'regex expression to match against file and folder paths'
    }),
    replacement: z.string({ 
      description: 'replacement string for matched patterns in file and folder paths'
    }),
    overwrite:  z.optional(z.boolean({ 
      description: 'Overwrite existing file or directory, default is false'
    }))
  })
);
