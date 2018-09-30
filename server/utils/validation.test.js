const expect = require("expect");
var { isRealString } = require("./validators");

describe("isRealString", () => {
  it("should reject non-string values", () => {
    var res = isRealString(89);
    expect(res).toBe(false);
  });
  it("should reject string with only spaces", () => {
    var res = isRealString("    ");
    expect(res).toBe(false);
  });
  it("should allow string with non-spaces", () => {
    var res = isRealString(" Guptaji   ");
    expect(res).toBe(true);
  });
});
