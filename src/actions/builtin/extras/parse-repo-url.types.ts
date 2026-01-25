import z from 'zod';

export const InputFieldsSchema = (_: typeof z) => (
  _.object({
    reposUrls: z.array(z.string({description: 'host?owner=any&organization=any&workspace=any&project=any'})),
  })
);

export const OutputSchema = (_: typeof z) => (
  _.object({
    repo: z.string({description: 'The repository name'}),
    host: z.string({description: 'The repository host'}),
    owner: z.string({description: 'The repository owner'}).optional(),
    organization: z.string({description: 'The repository organization for GitHub like'}).optional(),
    workspace: z.string({description: 'The repository workspace for Bitbucket like'}).optional(),
    project: z.string({description: 'The repository project for Azure DevOps like'}).optional(),
  })
)
