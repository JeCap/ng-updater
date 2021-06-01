#!/usr/bin/env node
// import { exec, ExecException } from 'child_process';
// import { Observable } from "rxjs";

import { exit } from "process";
import { of } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { exec$, ExecResult } from "./exec/exec";
import { buildNgUpdateCmd, parse$ } from "./parser/ng-update";

exec$('ng update')
  .pipe(
    mergeMap(execResult => parse$(execResult.stdout)),
    map(ngUpdatePackages => buildNgUpdateCmd(ngUpdatePackages)),
    mergeMap(cmd => {
      if (cmd !== undefined) {
        return exec$(cmd);
      }
      return of<ExecResult>({
        error: null,
        stdout: 'Nothing to do. Good job.',
        stderr: ''
      })
    })
  )
  .subscribe(r => {
    console.log(r.stdout);
    exit(0);
  })


