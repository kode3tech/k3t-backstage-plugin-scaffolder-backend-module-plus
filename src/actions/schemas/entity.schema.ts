import { Schema } from "jsonschema";

export const EntitySchema: Schema = {
  "type": "object",
  "properties": {
    "apiVersion": { "type": "string" },
    "kind": { "type": "string" },
    "metadata": {
      "type": "object",
      "properties": {
        "uid": { "type": "string" },
        "etag": { "type": "string" },
        "name": { "type": "string" },
        "namespace": { "type": "string" },
        "title": { "type": "string" },
        "description": { "type": "string" },
        "labels": {
          "type": "object",
          "additionalProperties": { "type": "string" }
        },
        "annotations": {
          "type": "object",
          "additionalProperties": { "type": "string" }
        },
        "tags": {
          "type": "array",
          "items": { "type": "string" }
        },
        "links": {
          "type": "array",
          "items": {
            "type": "object"  // Substitua por sua definição real de EntityLink
          }
        }
      },
      "required": ["name"]
    },
    "spec": { 
      "type": "object"
    },
    "relations": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": { "type": "string" },
          "targetRef": { "type": "string" }
        },
        "required": ["type", "targetRef"]
      }
    }
  },
  "required": ["apiVersion", "kind", "metadata"]
}