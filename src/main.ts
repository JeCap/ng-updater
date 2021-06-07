#!/usr/bin/env node
// import { exec, ExecException } from 'child_process';
// import { Observable } from "rxjs";

import * as arg from 'arg';
import { exit } from 'process';
import { of } from 'rxjs';
import { last, map, mergeMap, tap } from 'rxjs/operators';
import { exec$, ExecResult } from './exec/exec';
import { buildNgUpdateCmd, parse$ } from './parser/ng-update';

const args = arg.default({
  '--dryRun': Boolean,
  '--help': Boolean,
});

const exitProg = (exitCode: number) => {
  console.log(`ng-updater: exit with code ${exitCode}\n`);
  exit(exitCode);
};

if (args['--help']) {
  console.log(`Execute angular cli command "ng update" and install all new packages.

  ngu [options]
  or
  npx @jecap/ng-updater [options]

Options

  --dryRun          Run in dryMode. Nothing will be installed.
  --help            Show help
`);
  exitProg(0);
}

if (args['--dryRun']) {
  console.log('ng-updater: Running in `dryRun` mode');
}

exec$('ng update')
  .pipe(
    tap(execResult => {
      if (execResult.stdout.current !== undefined) {
        console.log(`${execResult.stdout.current}`);
      }
      if (execResult.stderr.current !== undefined) {
        console.log(`${execResult.stderr.current}`);
      }
    }),
    last(),
    mergeMap(execResult => {
      if (execResult.code === 0) {
        return parse$(execResult.stdout.toString());
      }
      // execution failed
      console.warn('ngUpdatePackages: discovery of the packets failed');
      exitProg(execResult.code);
    }),
    tap(ngUpdatePackages => {
      if (ngUpdatePackages.length > 0) {
        console.log(
          `ngUpdatePackages: ${ngUpdatePackages.length} package(s) ready for update`
        );
        ngUpdatePackages.forEach(item => {
          console.log(
            `ngUpdatePackages:   - ${item.package} ${item.version.to}`
          );
        });
      } else {
        console.log(`ngUpdatePackages: no packages found for update`);
      }
    }),
    map(ngUpdatePackages => buildNgUpdateCmd(ngUpdatePackages)),

    mergeMap(cmd => {
      if (args['--dryRun']) {
        const dryRun = new ExecResult();
        if (cmd !== undefined) {
          console.log(`execute: ${cmd}`);
        }
        dryRun.stdout.current = 'ng-updater: dryRun ist active. Nothing to do.';
        dryRun.closed = true;
        dryRun.code = 0;
        return of(dryRun);
      }
      if (cmd !== undefined) {
        return exec$(cmd);
      } else {
        const goodJob = new ExecResult();
        goodJob.stdout.current = 'ng-updater: Nothing to do. Good job.';
        goodJob.closed = true;
        goodJob.code = 0;
        return of(goodJob);
      }
    }),
    tap(execResult => {
      if (execResult.stdout.current !== undefined) {
        console.log(`${execResult.stdout.current}`);
      }
      if (execResult.stderr.current !== undefined) {
        console.log(`${execResult.stderr.current}`);
      }
    }),
    last()
  )
  .subscribe(r => {
    exitProg(r.code);
  });
