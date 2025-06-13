
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import { Schema } from 'jsonschema';
import * as uuid from 'uuid';
import { UUID_V4_GEN } from './ids';
import { examples } from "./uuid.examples";
import z from "zod";

export type FieldsType = {
  amount: number
};

export const FieldsSchema = z.object({
  amount: z.number({description: 'Amount of uuid to generate.'})
});

export type InputType = FieldsType

export const OutputSchema = z.object({
  results: z.array(z.string(), {description: 'List of generated uuid\'s.'})
})


export function createUuidV4GenAction() {

  return createTemplateAction({
    id: UUID_V4_GEN,
    description: 'Generate a list of UUID\'s v4',
    examples,
    schema: {
      input: {
        amount: (d) => d.number({description: 'Amount of uuid to generate.'}).default(1),
      },
      output: {
        results: (d) => d.array(z.string(), {description: 'List of generated uuid\'s.'})
      }
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
