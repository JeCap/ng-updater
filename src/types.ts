import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import simpleGit, { SimpleGit, StatusResult } from 'simple-git';
import { ExecResult } from './exec/exec';
import { NgUpdateResult, parseResult$ } from './parser/ng-update';

export class MainResult {
  execResult: ExecResult;
  parsedResults: NgUpdateResult[];
}

export const mainResult$ = (execResult: ExecResult): Observable<MainResult> =>
  parseResult$(execResult.stdout.all).pipe(
    map<NgUpdateResult[], MainResult>(parsedResults => ({
      execResult,
      parsedResults,
    }))
  );

export async function commitUpdates(mainresult: MainResult): Promise<void> {
  const git: SimpleGit = simpleGit({
    config: ['user.name=ng-updater[bot]', 'user.email=ng-updater-bot@capsius.de'],
  });

  const s: StatusResult = await git.status();

  const commitBody = mainresult.parsedResults
    .map(item => `  - ${item.package} from ${item.version.from} to ${item.version.to}\n`)
    .join('');

  const modified = s.modified.filter(item => ['package.json', 'package-lock.json'].find(searched => item === searched));
  if (modified.length > 0) {
    // add and commit this list
    await git.commit(`chore(ng-updater): auto update angular eco system \n\n${commitBody}`, modified);

    await git.push();
    console.log('finished');
  }
}
