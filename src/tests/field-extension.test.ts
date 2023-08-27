import { createField, extend, createPolynomial } from "..";

describe("", () => {
  it("", () => {
    let F = createField(6n);

    let P = createPolynomial(F);

    let ir = P.from([F.from(1n), F.from(0n), F.from(1n)]);

    let Fextended = extend(F, ir.coefficients, 2n);

    // let q = Fextended.from([F.from(0n), F.from(0n)]);

    // console.log(q.toString());
    let temp: string[] = [];
    for (let i = 0n; i < 80n; i++) {
      for (let j = 0n; j < 80n; j++) {
        let q = Fextended.from([F.from(i), F.from(j)]);

        let s = q.toPretty();
        if (temp.find((e) => e == s) === undefined) {
          temp.push(s);
        }
      }
    }

    console.log(temp);
  });
});
