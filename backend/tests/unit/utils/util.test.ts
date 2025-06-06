import { sleep } from "@/utils";

describe("Utilities", () => {
    describe("sleep", () => {
        const spy = vi.fn();

        beforeAll(() => {
            vi.useFakeTimers();
        });

        afterEach(vi.restoreAllMocks.bind(vi));
        afterAll(vi.useRealTimers.bind(vi));

        it("Should execute the function", async () => {
            const sleeper = sleep(1000)
                .then(spy)
                .catch(() => {
                    // Noop
                });

            vi.advanceTimersByTime(1000);

            await sleeper;

            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
});
