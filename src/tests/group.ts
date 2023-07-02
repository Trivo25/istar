import { Group, createField, createGroup } from "..";
describe("Elliptic Curve (Group) tests", () => {
  let G: Group;
  beforeAll(() => {
    G = createGroup(createField(251n));
  });

  it("test", () => {
    let res = Group.from({ y: 5n, x: 5n }).add(Group.from({ y: 2n, x: 2n }));
    console.log(res);
  });
});
