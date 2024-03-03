
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import { Schema } from 'jsonschema';
import * as uuid from 'uuid';
import { UUID_V4_GEN } from './ids';
import { examples } from "./uuid.examples";

export type FieldsType = {
  amount: number
} & JsonObject;

export const FieldsSchema: Schema = {
  type: 'object',
  required: ['amount'],
  properties: {
    amount: {
      title: 'Amount of uuid to generate ',
      type: 'number',
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
      title: 'List of generated uuid\'s.',
      type: "array",
      items: { 
        type: "string"
      },
    }
  }
}



export function createUuidV4GenAction() {

  return createTemplateAction<InputType, OutputType>({
    id: UUID_V4_GEN,
    description: 'Generate a list of UUID\'s v4',
    examples,
    schema: {
      input: InputSchema,
      output: OutputSchema,
    },

    async handler(ctx) {
      const { input: { amount }, output } = ctx
      const r = []
      for (let i = 0; i < amount; i++) {
        r.push(uuid.v4().toString())
      }
      output('results', r)
    }
  });
}
