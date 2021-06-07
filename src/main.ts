#!/usr/bin/env node
// import { exec, ExecException } from 'child_process';
// import { Observable } from "rxjs";

import * as arg from 'arg';
import { exit } from 'process';
import { of } from 'rxjs';
import { last, map, mergeMap, tap } from 'rxjs/operators';
import { exec$, ExecResult } from './exec/exec';
import { write, writeln } from './output/write';
import { buildNgUpdateCmd, parse$ } from './parser/ng-update';

const args = arg.default({
  '--dryRun': Boolean,
  '--help': Boolean,
});

const exitProg = (exitCode: number) => {
  writeln(`ng-updater: exit with code ${exitCode}`);
  exit(exitCode);
};

if (args['--help']) {
  writeln(`Execute angular cli command "ng update" and install all new packages.

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
  writeln('ng-updater: Running in `dryRun` mode');
}

exec$('ng update')
  .pipe(
    tap(execResult => {
      if (execResult.stdout.current !== undefined) {
        write(`${execResult.stdout.current}`);
      }
      if (execResult.stderr.current !== undefined) {
        write(`${execResult.stderr.current}`);
      }
    }),
    last(),
    mergeMap(execResult => {
      if (execResult.code === 0) {
        return parse$(execResult.stdout.all);
      }
      // execution failed
      writeln('ng-updater: discovery of the packets failed');
      exitProg(execResult.code);
    }),
    tap(ngUpdatePackages => {
      if (ngUpdatePackages.length > 0) {
        writeln(
          `\nngUpdatePackages: ${ngUpdatePackages.length} package(s) ready for update`
        );
        ngUpdatePackages.forEach(item => {
          writeln(`ng-updater:   - ${item.package} ${item.version.to}`);
        });
      } else {
        writeln(`\nngUpdatePackages: no packages found for update`);
      }
      writeln('');
    }),
    map(ngUpdatePackages => buildNgUpdateCmd(ngUpdatePackages)),

    mergeMap(cmd => {
      if (args['--dryRun']) {
        const dryRun = new ExecResult();
        if (cmd !== undefined) {
          writeln(`ng-updater: execute ${cmd}`);
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
        write(`${execResult.stdout.current}`);
      }
      if (execResult.stderr.current !== undefined) {
        write(`${execResult.stderr.current}`);
      }
    }),
    last()
  )
  .subscribe(r => {
    exitProg(r.code);
  });
