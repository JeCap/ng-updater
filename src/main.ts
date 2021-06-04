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
});
// const args = arg();

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
    mergeMap(execResult => parse$(execResult.stdout.toString())),
    tap(ngUpdatePackages => {
      console.log(
        `ngUpdatePackages: ${ngUpdatePackages.length} package(s) ready for update`
      );
      ngUpdatePackages.forEach(item => {
        console.log(`ngUpdatePackages:   - ${item.package} ${item.version.to}`);
      });
    }),
    map(ngUpdatePackages => buildNgUpdateCmd(ngUpdatePackages)),
    mergeMap(cmd => {
      if (args['--dryRun']) {
        const dryRun = new ExecResult();
        console.log(`execute: ${cmd}`);
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
    console.log(`ng-updater: ${r.code}\n`);
    exit(r.code);
  });
