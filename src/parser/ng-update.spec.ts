import { buildNgUpdateCmd, parse$, parseResult$ } from "./ng-update";
import {
  ngUpdateOutput,
  ngUpdateOutputGoodWork,
  ngUpdateOutputInstalled,
} from "./ng-update.spec.data";

describe("ng-update", () => {
  test("Parse$ should be executed and found updates", (done) => {
    parse$(ngUpdateOutput).subscribe((r) => {
      expect(r).toBeDefined();
      expect(r.length).toEqual(4);
      expect(
        r.find((item) => item.package === "@angular/cli")?.version.from
      ).toEqual("12.0.1");
      expect(
        r.find((item) => item.package === "@angular/cli")?.version.to
      ).toEqual("12.0.2");
      expect(
        r.find((item) => item.package === "@angular/cli")?.command
      ).toEqual("ng update");
      done();
    });
  });

  test("Parse$ should be executed and found no updates", (done) => {
    parse$(ngUpdateOutputGoodWork).subscribe((r) => {
      expect(r).toBeDefined();
      expect(r.length).toEqual(0);
      done();
    });
  });

  test("parseResult$ should be executed and have installed packages", (done) => {
    parseResult$(ngUpdateOutputInstalled).subscribe((r) => {
      expect(r).toBeDefined();
      expect(r.length).toEqual(14);
      expect(
        r.find((item) => item.package === "@angular/cli")?.version.from
      ).toEqual("12.0.1");
      expect(
        r.find((item) => item.package === "@angular/cli")?.version.to
      ).toEqual("12.0.2");
      done();
    });
  });

  test("buildNgUpdateCmd result should be undefined", (done) => {
    const r = buildNgUpdateCmd([]);
    expect(r).toBeUndefined();
    done();
  });
});
