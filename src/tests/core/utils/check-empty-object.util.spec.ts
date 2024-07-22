import { CheckObjectUtil} from "@utils/check-empty-object.util";

describe('CheckObjectUtil', () => {
    let util: CheckObjectUtil;

    beforeEach(() => {
        util = new CheckObjectUtil();
    });

    describe('isEmptyObject', () => {
        it('should return true for an empty object', () => {
            expect(util.isEmptyObject({})).toBe(true);
        });

        it('should return false for an object with properties', () => {
            expect(util.isEmptyObject({ key: 'value' })).toBe(false);
        });

        it('should return true for an empty object created with Object.create(null)', () => {
            expect(util.isEmptyObject(Object.create(null))).toBe(true);
        });

        it('should return false for an object with a non-enumerable property', () => {
            const obj = {};
            Object.defineProperty(obj, 'nonEnum', {
                value: 'value',
                enumerable: false
            });
            expect(util.isEmptyObject(obj)).toBe(true);
        });

        it('should return false for an object with inherited properties', () => {
            class Parent {
                parentProp = 'value';
            }

            class Child extends Parent {
                childProp = 'value';
            }

            const obj = new Child();
            expect(util.isEmptyObject(obj)).toBe(false);
        });

        it('should return false for a non-object', () => {
            expect(util.isEmptyObject(null)).toBe(false);
            expect(util.isEmptyObject(undefined)).toBe(false);
            expect(util.isEmptyObject(123)).toBe(false);
            expect(util.isEmptyObject('string')).toBe(false);
            expect(util.isEmptyObject(true)).toBe(false);
        });
    });
});
