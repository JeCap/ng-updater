export const ngUpdateOutput = `Using package manager: 'npm'
Collecting installed dependencies...
Found 73 dependencies.
    We analyzed your package.json, there are some packages to update:

      Name                                    Version                  Command to update
     -------------------------------------------------------------------------------------
      @angular-eslint/schematics              12.0.0 -> 12.1.0         ng update @angular-eslint/schematics
      @angular/cdk                            12.0.1 -> 12.0.3         ng update @angular/cdk
      @angular/cli                            12.0.1 -> 12.0.3         ng update @angular/cli
      @angular/core                           12.0.1 -> 12.0.3         ng update @angular/core

    There might be additional packages which don't provide 'ng update' capabilities that are outdated.
    You can update the additional packages by running the update command of your package manager.

`;

export const ngUpdateOutputInstalled = `ng update --force --allow-dirty @angular-eslint/schematics @angular/cdk @angular/cli @angular/core
Using package manager: 'npm'
Collecting installed dependencies...
Found 73 dependencies.
Fetching dependency metadata from registry...
    Updating package.json with dependency @angular-devkit/build-angular @ "12.0.2" (was "12.0.1")...
    Updating package.json with dependency @angular-eslint/schematics @ "12.1.0" (was "12.0.0")...
    Updating package.json with dependency @angular/cli @ "12.0.2" (was "12.0.1")...
    Updating package.json with dependency @angular/compiler-cli @ "12.0.2" (was "12.0.1")...
    Updating package.json with dependency @angular/language-service @ "12.0.2" (was "12.0.1")...
    Updating package.json with dependency @angular/animations @ "12.0.2" (was "12.0.1")...
    Updating package.json with dependency @angular/cdk @ "12.0.2" (was "12.0.1")...
    Updating package.json with dependency @angular/common @ "12.0.2" (was "12.0.1")...
    Updating package.json with dependency @angular/compiler @ "12.0.2" (was "12.0.1")...
    Updating package.json with dependency @angular/core @ "12.0.2" (was "12.0.1")...
    Updating package.json with dependency @angular/forms @ "12.0.2" (was "12.0.1")...
    Updating package.json with dependency @angular/platform-browser @ "12.0.2" (was "12.0.1")...
    Updating package.json with dependency @angular/platform-browser-dynamic @ "12.0.2" (was "12.0.1")...
    Updating package.json with dependency @angular/router @ "12.0.2" (was "12.0.1")...
  UPDATE package.json (4570 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular/core' **

> Automatically migrates shadow-piercing selector from \`/deep/\` to the recommanded alternative \`::ng-deep\`.
  Migration completed.`;

export const ngUpdateOutputGoodWork = `ng update
Using package manager: 'npm'
Collecting installed dependencies...
Found 11 dependencies.
    We analyzed your package.json and everything seems to be in order. Good work!`;
