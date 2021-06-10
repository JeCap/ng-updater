import { mainResult$ } from './types';

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
});
