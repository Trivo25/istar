import { createField, extend, createPolynomial } from "..";

describe("", () => {
  it("", () => {
    let k = 5n;
    let F = createField(k);

    let P = createPolynomial(F);

    let ir = P.from([F.from(2n), F.from(0n), F.from(1n)]);

    let Fextended = extend(F, ir.coefficients, 2n);

    // let x = Fextended.from([F.from(i), F.from(j)]);
    // let y = Fextended.from([F.from(i), F.from(j)]);

    // let temp: string[] = [];
    // for (let i = 0n; i < k; i++) {
    //   for (let j = 0n; j < k; j++) {
    //     let q = Fextended.from([F.from(i), F.from(j)]);

    //     let s = q.toPretty();
    //     if (temp.find((e) => e == s) === undefined) {
    //       temp.push(s);
    //     }
    //   }
    // }

    // console.log(temp);

    let x = Fextended.from([F.from(3n), F.from(4n)]);
    let x3 = x.mul(x).mul(x);

    let x3x = x3.add(x);
    let x3xa = x3x.add(Fextended.from([F.from(1n)]));
    console.log(x3xa.toPretty());

    //let x3a = x3.add(Fextended.from([F.from(1n)]))

    let y = Fextended.from([F.from(1n), F.from(2n)]);
    let y2 = y.mul(y);

    console.log(y2.toPretty());

    console.log("equals? ", x3xa.equals(y2));
  });
});
