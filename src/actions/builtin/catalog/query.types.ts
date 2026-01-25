import z from 'zod';
// import { Entity } from "@backstage/catalog-model";

export const InputFieldsSchema = (_: typeof z) => (
  _.object({
    fields: z.array(z.string()).optional(),
    limit: z.number({description: 'Limit the number of results returned.'}).optional(),
    filter: z.any().optional(),
    orderFields: z.object({
      field: z.string(),
      order: z.enum(['asc', 'desc'])
    }).optional(),
    fullTextFilter: z.object({
        term: z.string(),
        fields: z.array(z.string()),
    }).optional(),
  })
);

export type FieldsType = z.infer<ReturnType<typeof InputFieldsSchema>>;


export const OutputSchema = {
  results: (_: typeof z) => (
    _.array(
      _.array(
        _.any({description: 'The entity returned from the catalog query.'}), 
        { description: 'List of results' }
      ),
      {
        description: 'List of results from each query executed',
      }
    )
  )
}
