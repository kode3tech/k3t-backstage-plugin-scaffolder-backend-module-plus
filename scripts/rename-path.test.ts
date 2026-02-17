import { resolveSafeChildPath } from "@backstage/backend-plugin-api";
import globby from "globby";
import path from "path";
import { fstatSync, mkdirSync, renameSync, statSync } from "fs";

(() => {
  const {glob, pattern, replacement, overwrite } = {
    glob: './**/*',
    pattern: '/Cliente/g',
    replacement: 'OlaDotNet',
    overwrite: true
  };
  const ctx = {
    workspacePath: '/media/alf/xpg-data/dev/repo/github.com/cogna/cogna-core/idp-template-ms-dotnet/skeleton/component',
    isDryRun: false
  }
  const results: Array<{ from: string; to: string; status: string }> = [];
  const pathsResults: Array<typeof results> = [];


  const parsed = /\/(.+)\/([isdyugm]{0,})/g.exec(pattern);
  if (!parsed) {
    throw new Error([
      `Invalid regular expression '${pattern}'. `,
      `You must put raw ECMAScript syntax like '/hello/ig'.`,
      `Try build your expression using 'https://regex101.com', is a great tool.`
    ].join('\n'));
  }
  const regExp = new RegExp(parsed[1], parsed[2]);

  let founded = globby.sync(glob, { cwd: ctx.workspacePath, onlyDirectories: true })
    
  for (const currentPath of founded) {
    regExp.lastIndex = 0; // Reset lastIndex in case of global regex
    if (!regExp.test(currentPath)) continue;
    
    const sourceFilepath = resolveSafeChildPath(ctx.workspacePath,currentPath);
    const destFilepath = resolveSafeChildPath(ctx.workspacePath, currentPath.replace(regExp, replacement));

    try {
      if(!ctx.isDryRun) {
        renameSync(sourceFilepath, destFilepath);
        console.info(
          `File ${sourceFilepath} renamed to ${destFilepath} successfully`,
        );
      }
      results.push({ from: sourceFilepath, to: destFilepath, status: 'renamed' });
    } catch (err: any) {
      console.error(
        `Failed to rename file ${sourceFilepath} to ${destFilepath}:`,
        err,
      );
    }
  }
  
  founded = globby.sync(glob, { cwd: ctx.workspacePath, onlyFiles: true })
    
  for (const currentPath of founded) {
    regExp.lastIndex = 0; // Reset lastIndex in case of global regex
    if (!regExp.test(currentPath)) continue;
    
    const sourceFilepath = resolveSafeChildPath(ctx.workspacePath,currentPath);
    const destFilepath = resolveSafeChildPath(ctx.workspacePath, currentPath.replace(regExp, replacement));

    try {
      if(!ctx.isDryRun) {
        renameSync(sourceFilepath, destFilepath);
        console.info(
          `File ${sourceFilepath} renamed to ${destFilepath} successfully`,
        );
      }
      results.push({ from: sourceFilepath, to: destFilepath, status: 'renamed' });
    } catch (err: any) {
      console.error(
        `Failed to rename file ${sourceFilepath} to ${destFilepath}:`,
        err,
      );
    }
  }


  pathsResults.push(results);
})()