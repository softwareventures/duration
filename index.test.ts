import test from "ava";
import {fromSeconds, isValid, parsehhmmss, toSeconds} from ".";
import {
    add,
    divide,
    formathhmm,
    formathhmmFixed,
    formathhmmss,
    formathhmmssFixed,
    formatHoursFixed,
    formatMinutesFixed,
    formatmmss,
    formatmmssFixed, formatSecondsFixed,
    fromHours,
    fromMinutes,
    multiply,
    parsehhmm,
    roundToHour,
    roundToHours,
    roundToMinute,
    roundToMinutes,
    roundToSecond,
    roundToSeconds,
    subtract,
    toHours,
    toMinutes
} from "./index";

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

test("toMinutes", t => {
    t.is(toMinutes({}), 0);
    t.is(toMinutes({seconds: 80}), 1.3333333333333333);
    t.is(toMinutes({minutes: 3}), 3);
    t.is(toMinutes({minutes: 1.5, seconds: 2}), 1.5333333333333334);
    t.is(toMinutes({hours: 2}), 120);
    t.is(toMinutes({hours: 2.25, minutes: 0.5, seconds: 3}), 135.55);
    t.is(toMinutes({seconds: -5}), -0.08333333333333333);
    t.is(toMinutes({minutes: 1, seconds: -3}), 0.95);
    t.is(toMinutes({hours: -1, minutes: 8, seconds: 4}), -51.93333333333333);
});

test("fromMinutes", t => {
    t.deepEqual(fromMinutes(0), {hours: 0, minutes: 0, seconds: 0});
    t.deepEqual(fromMinutes(1.3333333333333333), {hours: 0, minutes: 1, seconds: 19.999999999999996});
    t.deepEqual(fromMinutes(3), {hours: 0, minutes: 3, seconds: 0});
    t.deepEqual(fromMinutes(1.5333333333333334), {hours: 0, minutes: 1, seconds: 32.00000000000001});
    t.deepEqual(fromMinutes(120), {hours: 2, minutes: 0, seconds: 0});
    t.deepEqual(fromMinutes(135.55), {hours: 2, minutes: 15, seconds: 33.00000000000068});
    t.deepEqual(fromMinutes(-0.08333333333333333), {hours: -0, minutes: -0, seconds: -5});
    t.deepEqual(fromMinutes(0.95), {hours: 0, minutes: 0, seconds: 57});
    t.deepEqual(fromMinutes(-51.93333333333333), {hours: -0, minutes: -51, seconds: -55.9999999999998});
});

test("toHours", t => {
    t.is(toHours({}), 0);
    t.is(toHours({seconds: 80}), 0.022222222222222223);
    t.is(toHours({minutes: 3}), 0.05);
    t.is(toHours({minutes: 1.5, seconds: 2}), 0.025555555555555557);
    t.is(toHours({hours: 2}), 2);
    t.is(toHours({hours: 2.25, minutes: 0.5, seconds: 3}), 2.2591666666666668);
    t.is(toHours({seconds: -5}), -0.001388888888888889);
    t.is(toHours({minutes: 1, seconds: -3}), 0.015833333333333335);
    t.is(toHours({hours: -1, minutes: 8, seconds: 4}), -0.8655555555555556);
});

test("fromHours", t => {
    t.deepEqual(fromHours(0), {hours: 0, minutes: 0, seconds: 0});
    t.deepEqual(fromHours(1.25), {hours: 1, minutes: 15, seconds: 0});
    t.deepEqual(fromHours(3), {hours: 3, minutes: 0, seconds: 0});
    t.deepEqual(fromHours(7.0525), {hours: 7, minutes: 3, seconds: 9.000000000000767});
    t.deepEqual(fromHours(-7.0525), {hours: -7, minutes: -3, seconds: -9.000000000000767});
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
    t.deepEqual(parsehhmmss("1:62:77"), {hours: 2, minutes: 3, seconds: 17});
});

test("parsehhmm", t => {
    t.is(parsehhmm(""), null);
    t.is(parsehhmm(":"), null);
    t.is(parsehhmm("::"), null);
    t.is(parsehhmm(":1.2"), null);
    t.is(parsehhmm("::2"), null);
    t.deepEqual(parsehhmm("0"), {hours: 0, minutes: 0, seconds: 0});
    t.deepEqual(parsehhmm("0.25"), {hours: 0, minutes: 0, seconds: 15});
    t.deepEqual(parsehhmm("1.5"), {hours: 0, minutes: 1, seconds: 30});
    t.deepEqual(parsehhmm("2"), {hours: 0, minutes: 2, seconds: 0});
    t.deepEqual(parsehhmm("0:13"), {hours: 0, minutes: 13, seconds: 0});
    t.deepEqual(parsehhmm("3:22.5"), {hours: 3, minutes: 22, seconds: 30});
    t.deepEqual(parsehhmm("3:2.5"), {hours: 3, minutes: 2, seconds: 30});
    t.is(parsehhmm("6:5:1"), null);
    t.deepEqual(parsehhmm("62:77"), {hours: 63, minutes: 17, seconds: 0});
});

test("formathhmmss", t => {
    t.is(formathhmmss({}), "0:00:00");
    t.is(formathhmmss({seconds: 1.2}), "0:00:01.2");
    t.is(formathhmmss({seconds: 2}), "0:00:02");
    t.is(formathhmmss({seconds: 13}), "0:00:13");
    t.is(formathhmmss({minutes: 3, seconds: 22.5}), "0:03:22.5");
    t.is(formathhmmss({minutes: 3, seconds: 2.5}), "0:03:02.5");
    t.is(formathhmmss({hours: 6, minutes: 5, seconds: 1}), "6:05:01");
    t.is(formathhmmss({hours: 1, minutes: 48, seconds: 23.25}), "1:48:23.25");
    t.is(formathhmmss({hours: 1, minutes: 62, seconds: 77}), "2:03:17");
});

test("formathhmmssFixed", t => {
    t.is(formathhmmssFixed({}, 1), "0:00:00.0");
    t.is(formathhmmssFixed({seconds: 1.2}), "0:00:01");
    t.is(formathhmmssFixed({seconds: 1.2}, 1), "0:00:01.2");
    t.is(formathhmmssFixed({seconds: 2}, 2), "0:00:02.00");
    t.is(formathhmmssFixed({seconds: 13}, 2), "0:00:13.00");
    t.is(formathhmmssFixed({minutes: 3, seconds: 22.5}), "0:03:23");
    t.is(formathhmmssFixed({minutes: 3, seconds: 22.5}, 1), "0:03:22.5");
    t.is(formathhmmssFixed({minutes: 3, seconds: 2.5}), "0:03:03");
    t.is(formathhmmssFixed({minutes: 3, seconds: 2.5}, 1), "0:03:02.5");
    t.is(formathhmmssFixed({hours: 6, minutes: 5, seconds: 1}), "6:05:01");
    t.is(formathhmmssFixed({hours: 1, minutes: 48, seconds: 23.25}), "1:48:23");
    t.is(formathhmmssFixed({hours: 1, minutes: 48, seconds: 23.25}, 1), "1:48:23.3");
    t.is(formathhmmssFixed({hours: 1, minutes: 62, seconds: 77}), "2:03:17");
});

test("formathhmm", t => {
    t.is(formathhmm({}), "0:00");
    t.is(formathhmm({seconds: 1.2}), "0:00.02");
    t.is(formathhmm({seconds: 3}), "0:00.05");
    t.is(formathhmm({minutes: 3, seconds: 21}), "0:03.35");
    t.is(formathhmm({hours: 6, minutes: 5, seconds: 6}), "6:05.1");
});

test("formathhmmFixed", t => {
    t.is(formathhmmFixed({}, 1), "0:00.0");
    t.is(formathhmmFixed({seconds: 1.2}, 0), "0:00");
    t.is(formathhmmFixed({seconds: 1.2}, 1), "0:00.0");
    t.is(formathhmmFixed({seconds: 1.2}, 2), "0:00.02");
    t.is(formathhmmFixed({seconds: 3}, 0), "0:00");
    t.is(formathhmmFixed({seconds: 3}, 1), "0:00.1");
    t.is(formathhmmFixed({seconds: 3}, 2), "0:00.05");
    t.is(formathhmmFixed({minutes: 3, seconds: 21}), "0:03");
    t.is(formathhmmFixed({minutes: 3, seconds: 21}, 1), "0:03.4");
    t.is(formathhmmFixed({minutes: 3, seconds: 21}, 2), "0:03.35");
    t.is(formathhmmFixed({hours: 6, minutes: 5, seconds: 6}), "6:05");
    t.is(formathhmmFixed({hours: 6, minutes: 5, seconds: 6}, 1), "6:05.1");
});

test("formatmmss", t => {
    t.is(formatmmss({}), "0:00");
    t.is(formatmmss({seconds: 1.2}), "0:01.2");
    t.is(formatmmss({seconds: 2}), "0:02");
    t.is(formatmmss({seconds: 13}), "0:13");
    t.is(formatmmss({minutes: 3, seconds: 22.5}), "3:22.5");
    t.is(formatmmss({minutes: 3, seconds: 2.5}), "3:02.5");
    t.is(formatmmss({hours: 6, minutes: 5, seconds: 1}), "365:01");
    t.is(formatmmss({hours: 1, minutes: 48, seconds: 23.25}), "108:23.25");
    t.is(formatmmss({hours: 1, minutes: 62, seconds: 77}), "123:17");
});

test("formatmmssFixed", t => {
    t.is(formatmmssFixed({}, 2), "0:00.00");
    t.is(formatmmssFixed({seconds: 1.2}, 0), "0:01");
    t.is(formatmmssFixed({seconds: 1.25}, 1), "0:01.3");
    t.is(formatmmssFixed({minutes: 3, seconds: 22.5}), "3:23");
    t.is(formatmmssFixed({minutes: 3, seconds: 22.5}, 1), "3:22.5");
    t.is(formatmmssFixed({minutes: 3, seconds: 22.5}, 2), "3:22.50");
    t.is(formatmmssFixed({minutes: 3, seconds: 2.5}), "3:03");
    t.is(formatmmssFixed({minutes: 3, seconds: 2.5}, 1), "3:02.5");
    t.is(formatmmssFixed({hours: 6, minutes: 5, seconds: 1}), "365:01");
    t.is(formatmmssFixed({hours: 1, minutes: 48, seconds: 23.25}), "108:23");
    t.is(formatmmssFixed({hours: 1, minutes: 48, seconds: 23.25}, 1), "108:23.3");
    t.is(formatmmssFixed({hours: 1, minutes: 48, seconds: 23.25}, 2), "108:23.25");
    t.is(formatmmssFixed({hours: 1, minutes: 62, seconds: 77}), "123:17");
});

test("formatHoursFixed", t => {
    t.is(formatHoursFixed({}), "0");
    t.is(formatHoursFixed({}, 2), "0.00");
    t.is(formatHoursFixed({seconds: 80}, 4), "0.0222");
    t.is(formatHoursFixed({seconds: 80}, 2), "0.02");
    t.is(formatHoursFixed({seconds: 80}, 1), "0.0");
    t.is(formatHoursFixed({minutes: 3}, 4), "0.0500");
    t.is(formatHoursFixed({minutes: 3}, 2), "0.05");
    t.is(formatHoursFixed({minutes: 3}, 1), "0.1");
    t.is(formatHoursFixed({minutes: 1.5, seconds: 2}, 4), "0.0256");
    t.is(formatHoursFixed({minutes: 1.5, seconds: 2}, 2), "0.03");
    t.is(formatHoursFixed({minutes: 1.5, seconds: 2}, 1), "0.0");
    t.is(formatHoursFixed({hours: 2}), "2");
    t.is(formatHoursFixed({hours: 2}, 2), "2.00");
    t.is(formatHoursFixed({hours: 2.25, minutes: 0.5, seconds: 3}, 4), "2.2592");
    t.is(formatHoursFixed({hours: 2.25, minutes: 0.5, seconds: 3}, 3), "2.259");
    t.is(formatHoursFixed({hours: 2.25, minutes: 0.5, seconds: 3}, 2), "2.26");
    t.is(formatHoursFixed({hours: 2.25, minutes: 0.5, seconds: 3}, 1), "2.3");
    t.is(formatHoursFixed({seconds: -5}, 4), "-0.0014");
    t.is(formatHoursFixed({minutes: 1, seconds: -3}, 4), "0.0158");
    t.is(formatHoursFixed({minutes: 1, seconds: -3}, 3), "0.016");
    t.is(formatHoursFixed({minutes: 1, seconds: -3}, 2), "0.02");
    t.is(formatHoursFixed({minutes: 1, seconds: -3}, 1), "0.0");
    t.is(formatHoursFixed({hours: -1, minutes: 8, seconds: 4}, 4), "-0.8656");
    t.is(formatHoursFixed({hours: -1, minutes: 8, seconds: 4}, 3), "-0.866");
    t.is(formatHoursFixed({hours: -1, minutes: 8, seconds: 4}, 2), "-0.87");
    t.is(formatHoursFixed({hours: -1, minutes: 8, seconds: 4}, 1), "-0.9");
});

test("formatMinutesFixed", t => {
    t.is(formatMinutesFixed({}), "0");
    t.is(formatMinutesFixed({seconds: 80}, 4), "1.3333");
    t.is(formatMinutesFixed({seconds: 80}, 2), "1.33");
    t.is(formatMinutesFixed({seconds: 80}, 1), "1.3");
    t.is(formatMinutesFixed({seconds: 80}), "1");
    t.is(formatMinutesFixed({minutes: 3}, 2), "3.00");
    t.is(formatMinutesFixed({minutes: 3}), "3");
    t.is(formatMinutesFixed({minutes: 1.5, seconds: 2}, 4), "1.5333");
    t.is(formatMinutesFixed({minutes: 1.5, seconds: 2}, 2), "1.53");
    t.is(formatMinutesFixed({minutes: 1.5, seconds: 2}, 1), "1.5");
    t.is(formatMinutesFixed({minutes: 1.5, seconds: 2}), "2");
    t.is(formatMinutesFixed({hours: 2}), "120");
    t.is(formatMinutesFixed({hours: 2}, 2), "120.00");
    t.is(formatMinutesFixed({hours: 2.25, minutes: 0.5, seconds: 3}, 3), "135.550");
    t.is(formatMinutesFixed({hours: 2.25, minutes: 0.5, seconds: 3}, 2), "135.55");
    t.is(formatMinutesFixed({hours: 2.25, minutes: 0.5, seconds: 3}, 1), "135.6");
    t.is(formatMinutesFixed({hours: 2.25, minutes: 0.5, seconds: 3}), "136");
    t.is(formatMinutesFixed({seconds: -5}, 4), "-0.0833");
    t.is(formatMinutesFixed({seconds: -5}, 2), "-0.08");
    t.is(formatMinutesFixed({seconds: -5}, 1), "-0.1");
    t.is(formatMinutesFixed({seconds: -5}), "-0");
    t.is(formatMinutesFixed({minutes: 1, seconds: -3}, 3), "0.950");
    t.is(formatMinutesFixed({minutes: 1, seconds: -3}, 2), "0.95");
    t.is(formatMinutesFixed({minutes: 1, seconds: -3}, 1), "0.9");
    t.is(formatMinutesFixed({minutes: 1, seconds: -3}), "1");
    t.is(formatMinutesFixed({hours: -1, minutes: 8, seconds: 4}, 4), "-51.9333");
    t.is(formatMinutesFixed({hours: -1, minutes: 8, seconds: 4}, 2), "-51.93");
    t.is(formatMinutesFixed({hours: -1, minutes: 8, seconds: 4}, 1), "-51.9");
    t.is(formatMinutesFixed({hours: -1, minutes: 8, seconds: 4}), "-52");
});

test("formatSecondsFixed", t => {
    t.is(formatSecondsFixed({}), "0");
    t.is(formatSecondsFixed({seconds: 80}), "80");
    t.is(formatSecondsFixed({minutes: 3}), "180");
    t.is(formatSecondsFixed({minutes: 1.5, seconds: 2}), "92");
    t.is(formatSecondsFixed({hours: 2}), "7200");
    t.is(formatSecondsFixed({hours: 2.25, minutes: 0.5, seconds: 3}), "8133");
    t.is(formatSecondsFixed({seconds: -5}), "-5");
    t.is(formatSecondsFixed({minutes: 1, seconds: -3}), "57");
    t.is(formatSecondsFixed({hours: -1, minutes: 8, seconds: 4}), "-3116");
    t.is(formatSecondsFixed({seconds: 2.34563}, 4), "2.3456",);
    t.is(formatSecondsFixed({seconds: 2.34563}, 2), "2.35",);
    t.is(formatSecondsFixed({seconds: 2.34563}, 1), "2.3",);
    t.is(formatSecondsFixed({seconds: 2.34563}), "2",);
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
    t.deepEqual(add({hours: 30, minutes: 23, seconds: 56}, {hours: 2, minutes: 46, seconds: 34}),
        {hours: 33, minutes: 10, seconds: 30});
});

test("subtract", t => {
    t.deepEqual(subtract({hours: 30, minutes: 23, seconds: 56}, {hours: 2, minutes: 46, seconds: 34}),
        {hours: 27, minutes: 37, seconds: 22})
});

test("multiply", t => {
    t.deepEqual(multiply({hours: 30, minutes: 23, seconds: 56}, 2.5),
        {hours: 75, minutes: 59, seconds: 50})
});

test("divide", t => {
    t.deepEqual(divide({hours: 30, minutes: 23, seconds: 56}, 2),
        {hours: 15, minutes: 11, seconds: 58});
});

test("roundToSecond", t => {
    t.deepEqual(roundToSecond({}), {hours: 0, minutes: 0, seconds: 0});
    t.deepEqual(roundToSecond({seconds: 1.2}), {hours: 0, minutes: 0, seconds: 1});
    t.deepEqual(roundToSecond({seconds: 2.8}), {hours: 0, minutes: 0, seconds: 3});
    t.deepEqual(roundToSecond({minutes: 2.499}), {hours: 0, minutes: 2, seconds: 30});
});

test("roundToSeconds", t => {
    t.deepEqual(roundToSeconds({}, 2), {hours: 0, minutes: 0, seconds: 0});
    t.deepEqual(roundToSeconds({seconds: 1.2}, 2), {hours: 0, minutes: 0, seconds: 2});
    t.deepEqual(roundToSeconds({seconds: 1}, 2), {hours: 0, minutes: 0, seconds: 2});
    t.deepEqual(roundToSeconds({seconds: 4.8}, 2), {hours: 0, minutes: 0, seconds: 4});
});

test("roundToMinute", t => {
    t.deepEqual(roundToMinute({}), {hours: 0, minutes: 0, seconds: 0});
    t.deepEqual(roundToMinute({minutes: 5.2}), {hours: 0, minutes: 5, seconds: 0});
    t.deepEqual(roundToMinute({minutes: 5.8}), {hours: 0, minutes: 6, seconds: 0});
    t.deepEqual(roundToMinute({minutes: 8, seconds: 20}), {hours: 0, minutes: 8, seconds: 0});
    t.deepEqual(roundToMinute({minutes: 8, seconds: 30}), {hours: 0, minutes: 9, seconds: 0});
});

test("roundToMinutes", t => {
    t.deepEqual(roundToMinutes({minutes: 7}, 2), {hours: 0, minutes: 8, seconds: 0});
    t.deepEqual(roundToMinutes({minutes: 34, seconds: 56}, 15), {hours: 0, minutes: 30, seconds: 0});
    t.deepEqual(roundToMinutes({minutes: 15, seconds: 1}, 10), {hours: 0, minutes: 20, seconds: 0});
});

test("roundToHour", t => {
    t.deepEqual(roundToHour({}), {hours: 0, minutes: 0, seconds: 0});
    t.deepEqual(roundToHour({hours: 5.2}), {hours: 5, minutes: 0, seconds: 0});
    t.deepEqual(roundToHour({hours: 5.8}), {hours: 6, minutes: 0, seconds: 0});
    t.deepEqual(roundToHour({hours: 8, minutes: 20}), {hours: 8, minutes: 0, seconds: 0});
    t.deepEqual(roundToHour({hours: 8, minutes: 30}), {hours: 9, minutes: 0, seconds: 0});
});

test("roundToHours", t => {
    t.deepEqual(roundToHours({}, 2), {hours: 0, minutes: 0, seconds: 0});
    t.deepEqual(roundToHours({hours: 1.2}, 2), {hours: 2, minutes: 0, seconds: 0});
    t.deepEqual(roundToHours({hours: 1}, 2), {hours: 2, minutes: 0, seconds: 0});
    t.deepEqual(roundToHours({hours: 4.8}, 2), {hours: 4, minutes: 0, seconds: 0});
    t.deepEqual(roundToHours({hours: 7}, 2), {hours: 8, minutes: 0, seconds: 0});
    t.deepEqual(roundToHours({hours: 34, minutes: 56, seconds: 17}, 15), {hours: 30, minutes: 0, seconds: 0});
    t.deepEqual(roundToHours({hours: 15, minutes: 1}, 10), {hours: 20, minutes: 0, seconds: 0});
});