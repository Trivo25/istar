import { Polynomial } from "..";
import { createFiniteField } from "..";

describe("", () => {
  it("", () => {
    const F5 = createFiniteField(15n);

    const p1 = Polynomial([F5(42n), F5(2n)]);
    const p2 = Polynomial([F5(2n), F5(511n)]);
    console.log(p1.add(p2));
  });
});
