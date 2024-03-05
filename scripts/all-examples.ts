import globby from "globby";
import path from "node:path"
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import { writeFileSync } from 'node:fs'

(async () => {
  const files = await globby(['src/**/*.example[s?].ts']);
  const lines = []
  for (const file of files) {
    const { examples }: {examples: TemplateExample[]} = await import(path.resolve(file));
    const action = /action: (.+)/gm.exec(examples[0].example)

    if(action && action[1]){
      lines.push(...[
        ``,
        `## ${action[1]}`,
        ``
      ])
    }

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