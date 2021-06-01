import { exec, ExecException } from 'child_process';
import { Observable } from "rxjs";

export interface ExecResult {
  error: ExecException;
  stdout: string;
  stderr: string;
}
export const exec$ = (name: string): Observable<ExecResult> => new Observable<ExecResult>((obs) => {
  console.log('execute: ', name);

  exec(name, (error, stdout, stderr) => {
    if (error !== null) {
      obs.error(error);
    } else {
      obs.next({ error, stdout, stderr });
    }
    console.log(stderr);
    console.log(stdout);
    obs.complete()
  })
});

