import { exec } from 'child_process';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { writeln } from '../output/write';

class test {
  constructor() {
    const t = 3;

    interval(1000).pipe(map(v => v));
  }
}

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
    writeln(`ng-updater: execute ${name}`);

    const ls = exec(name);
    let state: ExecResult = new ExecResult();

    ls.stdout.on('data', (data: string) => {
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
