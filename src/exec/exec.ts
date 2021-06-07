import { exec } from 'child_process';
import { Observable } from 'rxjs';

export class StdOutput {
  current = '';
  all = '';
}

export class ExecResult {
  stdout = new StdOutput();
  stderr = new StdOutput();
  code: number = undefined;
  closed = false;
}

export const exec$ = (name: string): Observable<ExecResult> =>
  new Observable<ExecResult>(obs => {
    console.log(`ngUpdatePackages: : execute ${name}`);

    const ls = exec(name);
    let state: ExecResult = new ExecResult();

    ls.stdout.on('data', data => {
      state = {
        ...state,
        stdout: {
          ...state.stdout,
          current: data,
          all: (state.stdout.all += data),
        },
      };

      obs.next(state);
    });

    ls.stderr.on('data', data => {
      state = {
        ...state,
        stderr: {
          ...state.stderr,
          current: data,
          all: (state.stderr.all += data),
        },
      };
      obs.next(state);
    });

    ls.on('close', code => {
      state = {
        ...state,
        closed: true,
        code,
        stdout: { ...state.stdout, current: undefined },
        stderr: { ...state.stderr, current: undefined },
      };
      obs.next(state);
      obs.complete();
    });
  });
