#!/usr/bin/env node
// import { exec, ExecException } from 'child_process';
// import { Observable } from "rxjs";

import { exit } from "process";
import { of } from "rxjs";
import { last, map, mergeMap, tap } from "rxjs/operators";
import { exec$, ExecResult } from "./exec/exec";
import { buildNgUpdateCmd, parse$ } from "./parser/ng-update";

exec$('ng update')
  .pipe(
    tap(execResult => {
      if (execResult.stdout.current !== undefined) {
        console.log(execResult.stdout.current);
      }
    }),
    last(),
    mergeMap(execResult => parse$(execResult.stdout.toString())),
    map(ngUpdatePackages => buildNgUpdateCmd(ngUpdatePackages)),
    mergeMap(cmd => {
      if (cmd !== undefined) {
        return exec$(cmd);
      }
      const goodJob = new ExecResult();
      goodJob.stdout.current = '\nng-updater: Nothing to do. Good job.';
      goodJob.closed = true;
      goodJob.code = 0;
      return of(goodJob);
    }),
    tap(execResult => {
      if (execResult.stdout.current !== undefined) {
        console.log(execResult.stdout.current);
      }

    }),
    last(),
  )
  .subscribe(r => {
    console.log(`ng-updater: exit ${r.code}`);
    exit(r.code);
  })


