function sleep(milliseconds) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve('success')
      }, milliseconds)
  })
}

describe('Jest Mocha Spec Reporter', () => {
  describe('tests to demonstrate the output', ()=> {
    it('this is a passing test', () => {});
    it.skip('this is a skipped test', () => {});
    it('this is a failing test', () => {
      expect(true).toEqual(false);
    });
  });
  describe("tests to demonstrate the duration output", ()=> {
    it("fast test", async () => {
      await sleep(20);
    })
    it("normal test", async () => {
      await sleep(40);
    })
    it("slow test", async () => {
      await sleep(80);
    })
  })
});
