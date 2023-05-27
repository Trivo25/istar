import { Polynomial, Field } from "..";

describe("Polynomial tests", () => {
  it("", () => {
    const F = Field;

    const p1 = Polynomial([F(12n), F(2n), F(1n)]);
    console.log(p1.eval(F(2n)));
  });

  it("", () => {
    const F = Field;

    // 12x
    const p1 = Polynomial([F(0n), F(12n)]);
    console.log(p1.eval(F(2n)));
  });
});
