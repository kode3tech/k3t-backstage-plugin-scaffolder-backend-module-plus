
## Fast Development

```sh
git submodule add git@github.com:kode3tech/k3t-backstage-plugin-scaffolder-backend-module-plus.git plugins/scaffolder-backend-module-plus
```


`packages/backend/package.json`

```json
  "dependencies": {
    ...
    "@k3tech/backstage-plugin-scaffolder-backend-module-plus": "link:../../plugins/scaffolder-backend-module-plus",
  }
```

## Publishing

```sh

yarn login

yarn examples && yarn release:full && yarn && yarn build &&  yarn pack && yarn publish --non-interactive

```