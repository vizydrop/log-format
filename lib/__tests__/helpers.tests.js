const {
    mapMeta
} = require(`../helpers`);

describe(`helpers`, () => {
    describe(`#mapMeta`, () => {
        it(`should do nothing if meta is missing`, () => {
            const fn = jest.fn();
            const info = {status: `status`};
            const result = mapMeta(fn)(info);
            expect(fn).not.toHaveBeenCalled();
        });

        it(`should map meta that is single item`, () => {
            const map = (v) => v * 2;
            const info = {meta: 4};
            const result = mapMeta(map)(info);
            expect(result.meta).toBe(8);
        });

        it(`should map meta that is array`, () => {
            const map = (v) => v * 2;
            const info = {meta: [4, 6, 8]};
            const result = mapMeta(map)(info);
            expect(result.meta).toEqual([8, 12, 16]);
        });
    });
});
