import { last, map, mergeMap, tap } from 'rxjs/operators';
import { exec$ } from './exec/exec';
import { buildNgUpdateCmd, parse$ } from './parser/ng-update';
import {
  ngUpdateOutput,
  ngUpdateOutputInstalled,
} from './parser/ng-update.spec.data';

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
        })),
        mergeMap(execResult => parse$(execResult.stdout.all)),
        map(ngUpdatePackages => buildNgUpdateCmd(ngUpdatePackages)),
        // TEST: map "ng update" to "dir"
        tap(v => {
          console.log(v);
        }),
        map(() => 'dir'),
        mergeMap(cmd => exec$(cmd)),
        last(),
        // TEST: map "dir" result to ngUpdateOutputInstalled
        map(execResult => ({
          ...execResult,
          stdout: {
            current: ngUpdateOutputInstalled,
            all: ngUpdateOutputInstalled,
          },
        }))
      )
      .subscribe(execResult => {
        expect(execResult.closed).toBe(true);
        done();
      });
  });
});
