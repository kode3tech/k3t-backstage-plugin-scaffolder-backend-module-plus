import globby from "globby";
import path from "node:path"
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import { writeFileSync } from 'node:fs'

(async () => {
  const files = await globby(['src/**/*.example[s?].ts']);
  const lines = []
  for (const file of files) {
    const { examples }: {examples: TemplateExample[]} = await import(path.resolve(file));
    for (const example of examples) {
      lines.push(...[
        `### ${example.description}`,
        '',
        '```yaml',
        example.example,
        '```',
        ''
      ])
    }
  }

  writeFileSync('exemples.md', lines.join(`\n`))

})()