import { last, map, mergeMap } from "rxjs/operators";
import { exec$, ExecResult, StdOutput } from "./exec/exec";
import { buildNgUpdateCmd, parse$ } from "./parser/ng-update";
import {
  ngUpdateOutput,
  ngUpdateOutputInstalled,
} from "./parser/ng-update.spec.data";

describe("main complex test cases", () => {
  test("test 1", (done) => {
    // use shell command "dir" as "ng update" for test
    exec$("dir")
      .pipe(
        last(),
        // TEST: map "dir" result to ngUpdateOutput
        map((execResult): ExecResult => {
          const stdout = new StdOutput();
          stdout.current = ngUpdateOutput;
          return { ...execResult, stdout };
        }),
        mergeMap((execResult) => parse$(execResult.stdout.toString())),
        map((ngUpdatePackages) => buildNgUpdateCmd(ngUpdatePackages)),
        // TEST: map "ng update" to "dir"
        map(() => "dir"),
        mergeMap((cmd) => exec$(cmd)),
        last(),
        // TEST: map "dir" result to ngUpdateOutputInstalled
        map((execResult): ExecResult => {
          const stdout = new StdOutput();
          stdout.current = ngUpdateOutputInstalled;
          return { ...execResult, stdout };
        })
      )
      .subscribe((execResult) => {
        expect(execResult.closed).toBe(true);
        done();
      });
  });
});
