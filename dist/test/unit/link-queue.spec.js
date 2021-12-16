import LinkQueue from "../../src/crawler/link-queue";
test("FizzBuzz test", () => {
    const linkQueue = new LinkQueue();
    linkQueue.enqueue('http://wonderbill.com');
    expect(linkQueue.length).toEqual(1);
});
//# sourceMappingURL=link-queue.spec.js.map