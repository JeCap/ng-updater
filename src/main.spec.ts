import { of } from 'rxjs';
import { last, map, mergeMap, tap } from 'rxjs/operators';
import { exec$, ExecResult } from './exec/exec';
import { write } from './output/write';
import { buildNgUpdateCmd, parse$ } from './parser/ng-update';
import { ngUpdateOutput, ngUpdateOutputInstalled } from './parser/ng-update.spec.data';
import { mainResult$ } from './types';

describe('main complex test cases', () => {
  test('test 1', done => {
    // use shell command "dir" as "ng update" for test
    exec$('dir')
      .pipe(
        last(),
        // TEST: map "dir" result to ngUpdateOutput
        map(execResult => ({
          ...execResult,
          stdout: {
            current: ngUpdateOutput,
            all: ngUpdateOutput,
          },
        }))
      )
      .pipe(
        mergeMap(execResult => parse$(execResult.stdout.all)),
        map(ngUpdatePackages => buildNgUpdateCmd(ngUpdatePackages)),
        // TEST: map "ng update" to "dir"
        tap(v => {
          write(v);
        }),
        map(() => 'dir'),
        mergeMap(cmd =>
          exec$(cmd).pipe(
            last(),
            // TEST: map "dir" result to ngUpdateOutputInstalled
            mergeMap(execResult =>
              of({
                ...execResult,
                stdout: {
                  current: ngUpdateOutputInstalled,
                  all: ngUpdateOutputInstalled,
                },
              } as ExecResult)
            )
          )
        ),
        mergeMap(execResult => mainResult$(execResult))
      )
      .subscribe(r => {
        expect(r.execResult.code).toBe(0);
        expect(r.parsedResults.length).toBe(14);
        done();
      });
  });
});
