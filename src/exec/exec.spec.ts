import { filter } from 'rxjs/operators';
import { exec$ } from './exec';

describe('exec', () => {
  test('exec should execute command "dir"', done => {
    exec$('dir').subscribe(r => {
      expect(r.stdout).toBeDefined();
      expect(r.stdout.toString().length).toBeGreaterThan(0);
      done();
    });
  });

  test('exec should be failed', done => {
    exec$('UNKOWN_CMD_XYZ')
      .pipe(filter(v => v.closed === true))
      .subscribe(r => {
        expect(r).toBeDefined();
        expect(r.stderr.current).toBeDefined();
        expect(r.code !== 0).toBeTruthy();
        done();
      });
  });
});
