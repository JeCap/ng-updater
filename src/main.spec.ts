import { map, mergeMap } from "rxjs/operators";
import { exec$, ExecResult } from "./exec/exec";
import { buildNgUpdateCmd, parse$ } from "./parser/ng-update";
import { ngUpdateOutput, ngUpdateOutputInstalled } from "./parser/ng-update.spec";



describe('main complex test cases', () => {

    test('test 1', done => {
        // use shell command "dir" as "ng update" for test
        exec$('dir')
            .pipe(
                // TEST: map "dir" result to ngUpdateOutput
                map((execResult): ExecResult => ({ error: execResult.error, stderr: execResult.stderr, stdout: ngUpdateOutput })),
                mergeMap(execResult => parse$(execResult.stdout)),
                map(ngUpdatePackages => buildNgUpdateCmd(ngUpdatePackages)),
                // TEST: map "ng update" to "dir"
                map(() => 'dir'),
                mergeMap(cmd => exec$(cmd)),
                map((execResult): ExecResult => ({ error: execResult.error, stderr: execResult.stderr, stdout: ngUpdateOutputInstalled })),

            )
            .subscribe(() => {
                done();
            })

    });


});
