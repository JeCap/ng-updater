import { exec } from 'child_process';
import { Observable } from "rxjs";



export class StdOutput {
  private _current: string;
  private _toString: string;

  public toString = (): string => {
    return this._toString.replace(/\n$/g, '');
  }

  public get current(): string {
    return this._current;
  }

  public set current(current: string
  ) {
    if (current !== undefined) {
      this._current = current.replace(/\n$/g, '');
      this._toString = this._toString + current;
    } else {
      this._current = undefined;
    }
  }

}

export class ExecResult {
  stdout = new StdOutput();
  stderr = new StdOutput();
  code: number = undefined;
  closed = false;
}

export const exec$ = (name: string): Observable<ExecResult> => new Observable<ExecResult>((obs) => {
  console.log('execute: ', name);

  const ls = exec(name);
  const state: ExecResult = new ExecResult();

  ls.stdout.on('data', (data) => {
    if (data !== undefined) {
      state.stdout.current = data.replace(/\n$/g, '');
      state.stderr.current = undefined;
      obs.next(state);
    }
  });

  ls.stderr.on('data', (data) => {
    if (data !== undefined) {
      state.stdout.current = undefined;
      state.stderr.current = data.replace(/\n$/g, '');
      obs.next(state);
    }
  });

  ls.on('close', (code) => {
    state.code = code;
    state.closed = true;
    state.stdout.current = undefined;
    obs.next(state);
    obs.complete()
  });

});

