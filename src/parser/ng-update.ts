import { Observable } from 'rxjs';

export interface NgVersion {
  from: string;
  to: string;
}

export interface NgUpdate {
  package: string;
  command: string;
  version: NgVersion;
}

export interface NgUpdateResult {
  package: string;
  version: NgVersion;
}

export const parse$ = (ngUpdateInfo: string): Observable<NgUpdate[]> =>
  new Observable<NgUpdate[]>(obs => {
    const rx = new RegExp(
      /(@.*?)( *)(\d+\.\d+\.\d+)( -> )(\d+\.\d+\.\d+)( *)(ng update)( *?)(@.*)/g
    );
    const matches = [...ngUpdateInfo.matchAll(rx)];
    const result = matches
      .filter(item => item[1] === item[9])
      .map(item => ({
        command: item[7],
        package: item[1],
        version: {
          from: item[3],
          to: item[5],
        },
      }));
    obs.next(result);
    obs.complete();
  });

//
export const parseResult$ = (
  ngUpdateResult: string
): Observable<NgUpdateResult[]> =>
  new Observable<NgUpdateResult[]>(obs => {
    const rx = new RegExp(
      /^( .*)(Updating package.json with dependency )(@.*)( @.*")(\d+\.\d+\.\d+)(" \(was ")(\d+\.\d+\.\d+)/gm
    );
    const matches = [...ngUpdateResult.matchAll(rx)];
    const result = matches.map(item => ({
      package: item[3],
      version: {
        from: item[7],
        to: item[5],
      },
    }));
    obs.next(result);
    obs.complete();
  });

export const buildNgUpdateCmd = (ngUpdate: NgUpdate[]): string =>
  ngUpdate.length > 0
    ? 'ng update --force --allow-dirty ' +
      ngUpdate.map(item => item.package).join(' ')
    : undefined;
