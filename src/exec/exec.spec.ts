import { of } from "rxjs";
import { catchError } from "rxjs/operators";
import { exec$ } from "./exec";

describe('exec', () => {

  test('exec should execute command "dir"', done => {
    exec$('dir').subscribe(r => {
      expect(r.error).toBeNull();
      expect(r.stdout).toBeDefined();
      expect(r.stdout.length).toBeGreaterThan(0);
      done();
    })

  });

  test('exec should be failed', done => {

    exec$('UNKOWN_CMD_XYZ')
      .pipe(
        catchError(error => {
          expect(error).toBeDefined();
          expect(error.cmd).toEqual('UNKOWN_CMD_XYZ');
          expect(error.code).toEqual(1);
          done();
          return of(error);
        })
      )
      .subscribe(r => {
        expect(r).toBeDefined();
      })

  });



})