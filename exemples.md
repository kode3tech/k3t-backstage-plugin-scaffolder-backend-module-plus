
## debug:fs:read:plus

### Debug read files in log stream

```yaml
steps:
  - action: debug:fs:read:plus
    id: debug-fs-read
    name: Read files
    input:
      files:
        - ./catalog-info.yaml
        - some-file.txt
      useMainLogger: true

```


## glob:plus

### Find files from Glob expressions

```yaml
steps:
  - action: glob:plus
    id: glob
    name: List files
    input:
      patterns:
        - "**/*.y[a?]ml"

```


## parse:repo-url:plus

### Parse Repo Url like "host?owner=any&organization=any&workspace=any&project=any"

```yaml
steps:
  - action: parse:repo-url:plus
    id: parse-repos-url
    name: Parse Repos URLs
    input:
      reposUrls:
        - host?owner=any&organization=any&workspace=any&project=any

```


## regex:fs:replace:plus

### Replace in files using Regex and Glob

```yaml
steps:
  - action: regex:fs:replace:plus
    id: regex-fs-replace
    name: Replace in files
    input:
      glob: "**/*.y[a?]ml"
      pattern: a
      replacement: b
      flags: g

```

### Replace on xml keeping original indentarion useful to Yaml, Json and XML formats.

```yaml
steps:
  - action: regex:fs:replace:plus
    id: regex-fs-replace
    name: Append spring-kafka
    input:
      pattern: ([\t ]+)</dependencies>
      glob: pom.xml
      replacement: |-
        $1	<dependency>
        $1		<!-- added from backstage -->
        $1		<groupId>org.springframework.kafka</groupId>
        $1		<artifactId>spring-kafka</artifactId>
        $1	</dependency>
        $1</dependencies>

```


## uuid:v4:gen:plus

### Generate 3 UUID's

```yaml
steps:
  - action: uuid:v4:gen:plus
    id: uuid-v4-gen
    name: UUID gen
    input:
      amount: 3

```


## vars:plus

### Proxy vars to reuse on next actions

```yaml
steps:
  - action: vars:plus
    id: reusable-vars
    name: Proxy vars
    input:
      vars:
        foo: my-prefixed-${{ parameters.name | lower }}-foo
        bar: bar-${{ parameters.value | lower }}

```


## catalog:query:plus

### Query in catalog

```yaml
steps:
  - action: catalog:query:plus
    id: query-in-catalog
    name: Query in catalog
    input:
      queries:
        - limit: 2
          fields:
            - metadata.name
          filter:
            metadata.annotations.backstage.io/template-origin: template:default/java-api
            relations.dependsOn: ${{ parameters.component_ref }}

```


## catalog:register:plus

### Register with the catalog

```yaml
steps:
  - action: catalog:register:plus
    id: register-with-catalog
    name: Register with the catalog
    input:
      infos:
        - catalogInfoUrl: http://github.com/backstage/backstage/blob/master/catalog-info.yaml

```

### Register with the catalog

```yaml
steps:
  - action: catalog:register:plus
    id: register-with-catalog
    name: Register with the catalog
    input:
      commonParams:
        optional: true
      infos:
        - catalogInfoUrl: http://github.com/backstage/backstage/blob/master/catalog-info.yaml
          optional: false
        - catalogInfoUrl: http://github.com/backstage/backstage/blob/master/catalog-info-two.yaml

```


## catalog:relation:plus

### Query in relations

```yaml
steps:
  - action: catalog:relation:plus
    id: query-in-relations
    name: Query in relations
    input:
      queries:
        - relations:
            - type: apiProvidedBy
              targetRef: component/default:customers-service
            - type: ownedBy
              targetRef: group/default:dream-devs
          optional: true
          relationType: apiProvidedBy

```


## fs:rename:plus

### Rename specified files 

```yaml
steps:
  - action: fs:rename:plus
    id: renameFiles
    name: Rename files
    input:
      commonParams:
        overwrite: true
      files:
        - from: file1.txt
          to: file1Renamed.txt
          overwrite: false
        - from: file2.txt
          to: file2Renamed.txt
          overwrite: false
        - from: file3.txt
          to: file3Renamed.txt

```


## fetch:plain:plus

### Downloads content and places it in the workspace.

```yaml
steps:
  - action: fetch:plain:plus
    id: fetch-plain
    name: Fetch plain
    input:
      commonParams:
        targetPath: ./
      sources:
        - url: https://github.com/backstage/community/tree/main/backstage-community-sessions/assets

```

### Optionally, if you would prefer the data to be downloaded to a subdirectory in the workspace you may specify the ‘targetPath’ input option.

```yaml
steps:
  - action: fetch:plain:plus
    id: fetch-plain
    name: Fetch plain
    input:
      sources:
        - url: https://github.com/backstage/community/tree/main/backstage-community-sessions/assets
          targetPath: fetched-data

```


## fetch:plain:file:plus

### Downloads multiple files and places it in the workspace.

```yaml
steps:
  - action: fetch:plain:file:plus
    id: fetch-plain-file
    name: Fetch plain file
    input:
      commonParams:
        url: https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png
      files:
        - targetPath: target-main
        - targetPath: target-optional

```


## fetch:template:plus

### Downloads multiple skeleton directories that lives alongside the template file and fill it out with common values.

```yaml
steps:
  - action: fetch:template:plus
    id: fetch-template
    name: Fetch template
    input:
      commonParams:
        values:
          name: test-project
          count: 1234
          itemList:
            - first
            - second
            - third
          showDummyFile: false
      templates:
        - url: ./skeleton
          targetPath: ./

```

### Downloads multiple skeleton directories that lives alongside the template file and fill it out with common values.

```yaml
steps:
  - action: fetch:template:plus
    id: fetch-template
    name: Fetch template
    input:
      commonParams:
        values:
          name: test-project
          count: 1234
          itemList:
            - first
            - second
            - third
          showDummyFile: false
      templates:
        - url: ./skeleton/main
          targetPath: ./target-main
        - url: ./skeleton/optional
          targetPath: ./target-optional

```


## zip:decompress:plus

### Decompress multiple files from same encoding type.

```yaml
steps:
  - action: zip:decompress:plus
    id: zip-decompress
    name: Decompress multiple files.
    input:
      commonParams:
        encoding: file
      sources:
        - content: ./compressed-1.zip
          destination: ./tmp.zip-1/
        - content: ./compressed-2.zip
          destination: ./tmp.zip-2/

```
