
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import { Schema } from 'jsonschema';
import { VARS } from './ids';
import { examples } from "./vars.examples";

export type FieldsType = JsonObject;

export const FieldsSchema: Schema = {
  type: 'object',
}

export const InputSchema: Schema = FieldsSchema

export type InputType = FieldsType

export type OutputFields = any

export type OutputType = {
  result: OutputFields
}


export const OutputSchema: Schema = {
  type: "object",
  properties: {
    result: {
      title: 'Parsed input param.',
      type: "object"
    }
  }
}

export function createVarsAction() {

  return createTemplateAction<InputType, OutputType>({
    id: VARS,
    description: 'Proxy template varriables/expressions',
    examples,
    schema: {
      input: InputSchema,
      output: OutputSchema,
    },

    async handler(ctx) {
      const { input, output, logger } = ctx
      logger.info(JSON.stringify(input, undefined, 2));
      output('result', input)
    }
  });
}
