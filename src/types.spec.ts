import { commitUpdates, mainResult$ } from './types';

describe('types test cases', () => {
  test('mainResult$ shoud be executed', done => {
    mainResult$({
      closed: true,
      code: 0,
      stdout: { all: '', current: undefined },
      stderr: { all: '', current: undefined },
    }).subscribe(v => {
      expect(v).toBeDefined();
      done();
    });
  });

  test('mainResult$ shoud be executed', done => {
    mainResult$({
      closed: true,
      code: 0,
      stdout: { all: '', current: undefined },
      stderr: { all: '', current: undefined },
    }).subscribe(v => {
      v.parsedResults.push({
        package: 'packages_1',
        version: { from: '1', to: '2' },
      });
      commitUpdates(v).then(() => {
        expect(v).toBeDefined();
        done();
      });
    });
  });
});
