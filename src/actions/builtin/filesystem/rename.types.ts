import z from 'zod';

export const FieldsSchema = (_: typeof z) => (
  _.object({
    from: z.string({ 
      description: 'The source location of the file to be renamed'
    }),
    to: z.string({ 
      description: 'The destination of the new file'
    }),
    overwrite:  z.optional(z.boolean({ 
      description: 'Overwrite existing file or directory, default is false'
    }))
  })
);
