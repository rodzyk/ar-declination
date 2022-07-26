import { Declination } from "../src/declination";
import { deepEqual, equal, throws } from 'assert';

describe('new Declination(str)', function () {
    describe('new Declination("")', function () {
        it(`should return Error`, function () {
            throws(() => { new Declination('') }, Error, "Parce error")
        });
       
    });


    describe('5-19', function () {

        function makeTest(x: number) {
            let expected = `${x} Хвилин`;
            var d = new Declination(`${x}Хвилина!а+и,!а`);

            it(`should return «${expected}» when x=${x} is between 5-19`, function () {
                equal(d.toString(), expected);
            });
        }

        for (let x = 5; x <= 19; x++) {
            makeTest(x);
        }
    });
    describe('Ends 1', function () {

        function makeTest(x: number) {
            let expected = `${x} Хвилина`;
            var d = new Declination(`${x}Хвилина!а+и,!а`);

            it(`should return «${expected}» when x=${x} is between 5-19`, function () {
                equal(d.toString(), expected);
            });
        }

        makeTest(1);
        makeTest(31);
        makeTest(101);

    });

    describe('Ends 2, 3, 4', function () {

        function makeTest(x: number) {
            let expected = `${x} Хвилини`;
            var d = new Declination(`${x}Хвилина!а+и,!а`);

            it(`should return «${expected}» when x=${x} is between 5-19`, function () {
                equal(d.toString(), expected);
            });
        }

        makeTest(2);
        makeTest(3);
        makeTest(4);

    });
});