const {create} = require(`../additionalFields`);

describe(`additionalFields`, () => {
    it(`should support initial fields`, () => {
        let count = 0;
        const additionalFields = create({
            count: () => count++,
            test: 1,
        });

        expect(additionalFields.getCurrentValues()).toEqual({count: 0, test: 1});
        expect(additionalFields.getCurrentValues()).toEqual({count: 1, test: 1});
    });

    it(`should support add fields`, () => {
        const additionalFields = create({test: 2});
        expect(additionalFields.getCurrentValues()).toEqual({test: 2});
        let count = 0;
        additionalFields.add({
            count: () => count++,
        });
        expect(additionalFields.getCurrentValues()).toEqual({count: 0, test: 2});
        expect(additionalFields.getCurrentValues()).toEqual({count: 1, test: 2});
    });

    it(`should support remove fields`, () => {
        let count = 0;
        const additionalFields = create({
            count: () => count++,
            test: 1,
        });

        additionalFields.remove([`count`]);
        expect(additionalFields.getCurrentValues()).toEqual({test: 1});
    });
});
