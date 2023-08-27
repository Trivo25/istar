import { createField, extend, createPolynomial, FieldExtension } from "..";

describe("", () => {
  it("", () => {
    let k = 5n;
    let F = createField(k);

    let P = createPolynomial(F);

    let ir = P.from([F.from(2n), F.from(0n), F.from(1n)]);

    let Fextended = extend(F, ir.coefficients, 2n);

    //all elements of F_k^2
    // let temp: string[] = [];
    // for (let i = 0n; i < k ** 2n; i++) {
    //   for (let j = 0n; j < k ** 2n; j++) {
    //     let q = Fextended.from([F.from(i), F.from(j)]);

    //     let s = q.toPretty();
    //     if (temp.find((e) => e == s) === undefined) {
    //       temp.push(s);
    //     }
    //   }
    // }
    // console.log(temp);

    let points: FieldExtension[] = [];
    for (let i = 0n; i < k ** 2n; i++) {
      for (let j = 0n; j < k ** 2n; j++) {
        let q = Fextended.from([F.from(i), F.from(j)]);

        if (points.find((e) => e.equals(q)) === undefined) {
          points.push(q);
        }
      }
    }
    console.log("---------------");
    let group: { x: string; y: string }[] = [];
    for (let i = 0; i < points.length; i++) {
      let x = points[i];
      for (let j = 0; j < points.length; j++) {
        let y = points[j];

        let x3 = x.mul(x).mul(x);
        let x3x = x3.add(x);
        let x3xa = x3x.add(Fextended.from([F.from(1n)]));

        let y2 = y.mul(y);

        if (x3xa.equals(y2)) {
          group.push({
            x: x.toPretty(),
            y: y.toPretty(),
          });
        }
      }
    }

    console.log(group);
  });
});
