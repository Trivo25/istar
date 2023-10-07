import { Groth16, createField } from "..";

describe("Groth16 tests", () => {
  it("test", () => {
    const F = createField(251n);
    const Groth = Groth16.create(F);
    Groth.setup();
  });
});
