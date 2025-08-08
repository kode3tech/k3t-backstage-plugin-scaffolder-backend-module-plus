
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { VARS } from './ids';
import { examples } from "./vars.examples";
import  z from "zod";

export type FieldsType = { }

export const FieldsSchema = z.any();

export type InputType = FieldsType

export const OutputSchema = z.object({
  result: z.object({})
})

export function createVarsAction() {

  return createTemplateAction({
    id: VARS,
    description: 'Proxy template varriables/expressions',
    examples,
    schema: {
      input: {

      },
      output: {
        result: (d) => d.object({})
      }
    },

    async handler(ctx) {
      const { input, output, logger } = ctx
      logger.info(JSON.stringify(input, undefined, 2));
      output('result', input)
    }
  });
}
