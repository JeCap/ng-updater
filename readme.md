# ng-updater

## about

ng-update helps you to execute your angular updates in one step. It execute `ng update` of the angular cli to get the update packages. Afterwards these packages (if available) are installed with `ng update package, package,... --force --allow-dirty`.

## install

Install directly to your angular project

`npm install @jecap/ng-updater -D`

or globally

`npm install @jecap/ng-updater -g`

### Remember

`ng-update` is only provided as an npm package on github. So you need to add `@jecap:registry=https://npm.pkg.github.com`to your `.npmrc`

```ini
registry=http://registry.npmjs.org
@jecap:registry=https://npm.pkg.github.com
```

## how to use

That's simple. Execute `ngu` or `npx ngu` in your shell.

```dos
> ngu
execute: ng update
Using package manager: 'npm'

Collecting installed dependencies...
Found 73 dependencies.

    We analyzed your package.json, there are some packages to update:


      Name                                    Version                  Command to update
     -------------------------------------------------------------------------------------
      @angular/cdk                            12.0.2 -> 12.0.3         ng update @angular/cdk
      @angular/cli                            12.0.1 -> 12.0.3         ng update @angular/cli
      @angular/core                           12.0.1 -> 12.0.3         ng update @angular/core

    There might be additional packages which don't provide 'ng update' capabilities that are outdated.
    You can update the additional packages by running the update command of your package manager.
execute: ng update --force --allow-dirty @angular/core
Repository is not clean. Update changes will be mixed with pre-existing changes.
Using package manager: 'npm'
Collecting installed dependencies...

Found 73 dependencies.

Fetching dependency metadata from registry...
    Updating package.json with dependency @angular/compiler-cli @ "12.0.3" (was "12.0.1")...

    Updating package.json with dependency @angular/language-service @ "12.0.3" (was "12.0.1")...
    Updating package.json with dependency @angular/animations @ "12.0.3" (was "12.0.1")...
    Updating package.json with dependency @angular/common @ "12.0.3" (was "12.0.1")...
    Updating package.json with dependency @angular/compiler @ "12.0.3" (was "12.0.1")...
    Updating package.json with dependency @angular/core @ "12.0.3" (was "12.0.1")...
    Updating package.json with dependency @angular/forms @ "12.0.3" (was "12.0.1")...
    Updating package.json with dependency @angular/platform-browser @ "12.0.3" (was "12.0.1")...
    Updating package.json with dependency @angular/platform-browser-dynamic @ "12.0.3" (was "12.0.1")...
    Updating package.json with dependency @angular/router @ "12.0.3" (was "12.0.1")...
  UPDATE package.json (4557 bytes)
- Installing packages...
✔ Packages successfully installed.
** Executing migrations of package '@angular/core' **

> Automatically migrates shadow-piercing selector from `/deep/` to the recommanded alternative `::ng-deep`.
  Migration completed.

ng-updater: exit 0
```
