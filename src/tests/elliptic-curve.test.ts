import { EC } from "..";
describe("Elliptic Curve tests", () => {
  it("test", () => {
    let res = EC({ y: 5n, x: 5n }).add(EC({ y: 2n, x: 2n }));
    console.log(res);
  });
});
