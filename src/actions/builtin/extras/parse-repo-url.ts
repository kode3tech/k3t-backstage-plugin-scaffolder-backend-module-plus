import { InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import { Schema } from 'jsonschema';
import { PARSE_REPO_URL } from './ids';
import { examples } from "./parse-repo-url.examples";

export type FieldsType = {
  reposUrls: string[];
} & JsonObject;

export const FieldsSchema: Schema = {
  type: 'object',
  required: ['reposUrls'],
  properties: {
    reposUrls: { 
      title: 'reposUrls',
      description: 'reposUrls',
      type: 'array',
      items: { type: 'string'}
    }
  },
}


export const InputSchema: Schema = FieldsSchema

export type InputType = FieldsType

export type OutputFields = RepoSpec

export type OutputType = {
  results: Array<OutputFields>
}


export const OutputSchema: Schema = {
  type: "object",
  properties: {
    results: {
      type: "array",
      items: { 
        type: "object",
        properties: {
          repo: {
            type: 'string',
          },
          host: {
            type: 'string',
          },
          owner: {
            type: 'string',
          },
          organization: {
            type: 'string',
          },
          workspace: {
            type: 'string',
          },
          project: {
            type: 'string',
          },
        
        }
      },
    }
  }
}


export type RepoSpec = {
  repo: string;
  host: string;
  owner?: string;
  organization?: string;
  workspace?: string;
  project?: string;
};

/**
 *  
 * @param repoUrl  host?owner=any&organization=any&workspace=any&project=any
 * @param integrations 
 * @returns 
 */
export const parseRepoUrl = (
  repoUrl: string,
  integrations: ScmIntegrationRegistry,
): RepoSpec => {
  let parsed;
  try {
    parsed = new URL(`https://${repoUrl}`);
  } catch (error) {
    throw new InputError(
      `Invalid repo URL passed to publisher, got ${repoUrl}, ${error}`,
    );
  }
  const host = parsed.host;
  const owner = parsed.searchParams.get('owner') ?? undefined;
  const organization = parsed.searchParams.get('organization') ?? undefined;
  const workspace = parsed.searchParams.get('workspace') ?? undefined;
  const project = parsed.searchParams.get('project') ?? undefined;

  const type = integrations.byHost(host)?.type;

  if (!type) {
    throw new InputError(
      `No matching integration configuration for host ${host}, please check your integrations config`,
    );
  }

  if (type === 'bitbucket') {
    if (host === 'bitbucket.org') {
      if (!workspace) {
        throw new InputError(
          `Invalid repo URL passed to publisher: ${repoUrl}, missing workspace`,
        );
      }
    }
    if (!project) {
      throw new InputError(
        `Invalid repo URL passed to publisher: ${repoUrl}, missing project`,
      );
    }
  } else {
    if (!owner) {
      throw new InputError(
        `Invalid repo URL passed to publisher: ${repoUrl}, missing owner`,
      );
    }
  }

  const repo = parsed.searchParams.get('repo');
  if (!repo) {
    throw new InputError(
      `Invalid repo URL passed to publisher: ${repoUrl}, missing repo`,
    );
  }

  return { host, owner, repo, organization, workspace, project };
};


export function createParseRepoUrlAction(options: {
  integrations: ScmIntegrationRegistry
}) {
  const { integrations } = options;

  return createTemplateAction<InputType, OutputType>({
    id: PARSE_REPO_URL,
    description:
      'Parse Repo url like "host?owner=any&organization=any&workspace=any&project=any"',
    examples,
    schema: {
      input: InputSchema,
      output: OutputSchema,
    },

    async handler(ctx) {
      ctx.logger.info('Parsing repos urls');

      const { input: { reposUrls }, logger, output } = ctx;
      const results = []
      
      for (const repoUrl of reposUrls) {
        
        try {
          const parsed = parseRepoUrl(repoUrl, integrations)
          results.push(parsed);
        } catch (e: any) {
          logger.error(e?.message);
        }
      }
      
      output('results', results)
    }
  });
}
