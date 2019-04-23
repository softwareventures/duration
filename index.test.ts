import test from "ava";
import {fromSeconds, isValid, parsehhmmss, toSeconds} from ".";
import {add} from "./index";

test("isValid", t => {
    t.true(isValid({}));
    t.true(isValid({seconds: 0}));
    t.true(isValid({seconds: 0.5}));
    t.false(isValid({seconds: -1}));
    t.true(isValid({seconds: 61}));
    t.true(isValid({minutes: 0}));
    t.true(isValid({minutes: 0.5}));
    t.false(isValid({minutes: -1}));
    t.true(isValid({minutes: 61}));
    t.true(isValid({hours: 0}));
    t.true(isValid({hours: 0.5}));
    t.false(isValid({hours: -1}));
    t.true(isValid({hours: 25}));
    t.true(isValid({minutes: 1.5, seconds: 2}));
    t.true(isValid({hours: 2.25, minutes: 0.5, seconds: 3}));
    t.false(isValid({minutes: 1, seconds: -3}));
    t.false(isValid({hours: -1, minutes: 8, seconds: 4}));
});

test("toSeconds", t => {
    t.is(toSeconds({}), 0);
    t.is(toSeconds({seconds: 80}), 80);
    t.is(toSeconds({minutes: 3}), 180);
    t.is(toSeconds({minutes: 1.5, seconds: 2}), 92);
    t.is(toSeconds({hours: 2}), 7200);
    t.is(toSeconds({hours: 2.25, minutes: 0.5, seconds: 3}), 8133);
    t.is(toSeconds({seconds: -5}), -5);
    t.is(toSeconds({minutes: 1, seconds: -3}), 57);
    t.is(toSeconds({hours: -1, minutes: 8, seconds: 4}), -3116);
});

test("fromSeconds", t => {
    t.deepEqual(fromSeconds(0), {hours: 0, minutes: 0, seconds: 0});
    t.deepEqual(fromSeconds(80), {hours: 0, minutes: 1, seconds: 20});
    t.deepEqual(fromSeconds(180), {hours: 0, minutes: 3, seconds: 0});
    t.deepEqual(fromSeconds(92), {hours: 0, minutes: 1, seconds: 32});
    t.deepEqual(fromSeconds(7200), {hours: 2, minutes: 0, seconds: 0});
    t.deepEqual(fromSeconds(8133), {hours: 2, minutes: 15, seconds: 33});
    t.deepEqual(fromSeconds(-5), {hours: -1, minutes: 59, seconds: 55});
    t.deepEqual(fromSeconds(57), {hours: 0, minutes: 0, seconds: 57});
    t.deepEqual(fromSeconds(-3116), {hours: -1, minutes: 8, seconds: 4});
});

test("parsehhmmss", t => {
    t.is(parsehhmmss(""), null);
    t.is(parsehhmmss(":"), null);
    t.is(parsehhmmss("::"), null);
    t.is(parsehhmmss(":1.2"), null);
    t.is(parsehhmmss("::2"), null);
    t.deepEqual(parsehhmmss("0"), {hours: 0, minutes: 0, seconds: 0});
    t.deepEqual(parsehhmmss("0.1"), {hours: 0, minutes: 0, seconds: 0.1});
    t.deepEqual(parsehhmmss("1.2"), {hours: 0, minutes: 0, seconds: 1.2});
    t.deepEqual(parsehhmmss("2"), {hours: 0, minutes: 0, seconds: 2});
    t.deepEqual(parsehhmmss("0:13"), {hours: 0, minutes: 0, seconds: 13});
    t.deepEqual(parsehhmmss("3:22.5"), {hours: 0, minutes: 3, seconds: 22.5});
    t.deepEqual(parsehhmmss("3:2.5"), {hours: 0, minutes: 3, seconds: 2.5});
    t.deepEqual(parsehhmmss("6:5:1"), {hours: 6, minutes: 5, seconds: 1});
    t.deepEqual(parsehhmmss("1:48:23.25"), {hours: 1, minutes: 48, seconds: 23.25});
    t.deepEqual(parsehhmmss("1:62:77"), {hours: 1, minutes: 62, seconds: 77});
});

test("add", t => {
    t.deepEqual(add({}, {}), {hours: 0, minutes: 0, seconds: 0});
    t.deepEqual(add({}, {seconds: 37}), {hours: 0, minutes: 0, seconds: 37});
    t.deepEqual(add({}, {seconds: 82}), {hours: 0, minutes: 1, seconds: 22});
    t.deepEqual(add({}, {seconds: 34.478}), {hours: 0, minutes: 0, seconds: 34.478});
    t.deepEqual(add({}, {minutes: 53}), {hours: 0, minutes: 53, seconds: 0});
    t.deepEqual(add({}, {minutes: 154}), {hours: 2, minutes: 34, seconds: 0});
    t.deepEqual(add({}, {minutes: 154.5}), {hours: 2, minutes: 34, seconds: 30});
    t.deepEqual(add({}, {hours: 4}), {hours: 4, minutes: 0, seconds: 0});
    t.deepEqual(add({}, {hours: 4.25}), {hours: 4, minutes: 15, seconds: 0});
    t.deepEqual(add({seconds: 22}, {}), {hours: 0, minutes: 0, seconds: 22});
    t.deepEqual(add({seconds: 23}, {seconds: 4}), {hours: 0, minutes: 0, seconds: 27});
    t.deepEqual(add({seconds: 25}, {seconds: 98}), {hours: 0, minutes: 2, seconds: 3});
    t.deepEqual(add({seconds: 33}, {minutes: 1}), {hours: 0, minutes: 1, seconds: 33});
    t.deepEqual(add({hours: 30, minutes: 23, seconds: 56},{hours: 2, minutes: 46, seconds: 34}),
        {hours: 33, minutes: 10, seconds: 30});
});