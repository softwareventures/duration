import isInteger = require("is-integer");
import trunc = require("math-trunc");
import {isIntegerInRange, isNonNegativeFinite} from "./util";

/** A length of time. */
export interface Duration {
    hours: number;
    minutes: number;
    seconds: number;
}

export type DurationLike = Readonly<Partial<Duration>>;

export function isValid(duration: DurationLike): boolean {
    const hours = duration.hours == null ? 0 : duration.hours;
    const minutes = duration.minutes == null ? 0 : duration.minutes;
    const seconds = duration.seconds == null ? 0 : duration.seconds;

    return isNonNegativeFinite(hours)
        && isNonNegativeFinite(minutes)
        && isNonNegativeFinite(seconds);
}

export function validate(duration: DurationLike): void {
    if (!isValid(duration)) {
        throw new TypeError("Invalid duration");
    }
}

export function isNormal(duration: Readonly<Duration>): boolean {
    return isInteger(duration.hours)
        && isIntegerInRange(duration.minutes, 0, 59)
        && isNonNegativeFinite(duration.seconds)
        && duration.seconds < 60;
}

export function normalize(duration: DurationLike): Duration {
    return fromSeconds(toSeconds(duration));
}

export const zero: Duration = {hours: 0, minutes: 0, seconds: 0};

export function toSeconds(duration: DurationLike): number {
    const hours = duration.hours == null ? 0 : duration.hours;
    const minutes = duration.minutes == null ? 0 : duration.minutes;
    const seconds = duration.seconds == null ? 0 : duration.seconds;
    return hours * 3600 + minutes * 60 + seconds;
}

export function fromSeconds(seconds: number): Duration {
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return {hours, minutes, seconds};
}

export function toMinutes(duration: DurationLike): number {
    const hours = duration.hours == null ? 0 : duration.hours;
    const minutes = duration.minutes == null ? 0 : duration.minutes;
    const seconds = duration.seconds == null ? 0 : duration.seconds;
    return hours * 60 + minutes + seconds / 60;
}

export function fromMinutes(minutes: number): Duration {
    const hours = trunc(minutes / 60);
    const seconds = (minutes % 1) * 60;
    minutes = trunc(minutes - hours * 60);
    return {hours, minutes, seconds};
}

export function toHours(duration: DurationLike): number {
    const hours = duration.hours == null ? 0 : duration.hours;
    const minutes = duration.minutes == null ? 0 : duration.minutes;
    const seconds = duration.seconds == null ? 0 : duration.seconds;
    return hours + minutes / 60 + seconds / 3600;
}

export function fromHours(hours: number): Duration {
    const truncatedHours = trunc(hours);
    const minutes = (hours - truncatedHours) * 60;
    const truncatedMinutes = trunc(minutes);
    const seconds = (minutes - truncatedMinutes) * 60;
    return {hours: truncatedHours, minutes: truncatedMinutes, seconds};
}

export function parsehhmmss(duration: string): Duration | null {
    const matches = /^\s*(?:(?:([0-9]+):)?([0-9]+):)?([0-9]+(?:\.[0-9]*)?|\.[0-9]+)\s*$/.exec(duration);

    if (matches == null) {
        return null;
    } else {
        const hours = matches[1] == null
            ? 0
            : parseInt(matches[1], 10);
        const minutes = matches[2] == null
            ? 0
            : parseInt(matches[2], 10);
        const seconds = matches[3] == null
            ? 0
            : parseFloat(matches[3]);

        return normalize({hours, minutes, seconds});
    }
}

export function parsehhmm(duration: string): Duration | null {
    const matches = /^\s*(?:([0-9]+):)?([0-9]+(?:\.[0-9]*)?|\.[0-9]+)\s*$/.exec(duration);

    if (matches == null) {
        return null;
    } else {
        const hours = matches[1] == null
            ? 0
            : parseInt(matches[1], 10);
        const minutes = matches[2] == null
            ? 0
            : parseFloat(matches[2]);

        return normalize({hours, minutes});
    }
}

export function formathhmmss(duration: DurationLike): string {
    const {hours, minutes, seconds} = normalize(duration);
    return "" + hours + ":"
        + ("0" + minutes).substr(-2) + ":"
        + ("0" + seconds).replace(/^0?([0-9]{2})/, "$1");
}

export function formathhmmssFixed(duration: DurationLike, fractionDigits = 0): string {
    const {hours, minutes, seconds} = normalize(duration);
    return "" + hours + ":"
        + ("0" + minutes).substr(-2) + ":"
        + ("0" + seconds.toFixed(fractionDigits)).replace(/^0?([0-9]{2})/, "$1");
}

export function formathhmmssFixedFn(fractionDigits = 0): (duration: DurationLike) => string {
    return duration => formathhmmssFixed(duration, fractionDigits);
}

export function formathhmm(duration: DurationLike): string {
    const n = normalize(duration);
    const {hours} = n;
    const minutes = n.minutes + n.seconds / 60;
    return "" + hours + ":" + ("0" + minutes).replace(/^0?([0-9]{2})/, "$1");
}

export function formathhmmFixed(duration: DurationLike, fractionDigits = 0): string {
    const n = normalize(duration);
    const {hours} = n;
    const minutes = n.minutes + n.seconds / 60;
    return "" + hours + ":"
        + ("0" + minutes.toFixed(fractionDigits)).replace(/^0?([0-9]{2})/, "$1");
}

export function formathhmmFixedFn(fractionDigits = 0): (duration: DurationLike) => string {
    return duration => formathhmmFixed(duration, fractionDigits);
}

export function formatmmss(duration: DurationLike): string {
    const n = normalize(duration);
    const minutes = n.hours * 60 + n.minutes;
    const {seconds} = n;
    return "" + minutes + ":" + ("0" + seconds).replace(/^0?([0-9]{2})/, "$1");
}

export function formatmmssFixed(duration: DurationLike, fractionDigits = 0): string {
    const n = normalize(duration);
    const minutes = n.hours * 60 + n.minutes;
    const {seconds} = n;
    return "" + minutes + ":"
        + ("0" + seconds.toFixed(fractionDigits)).replace(/^0?([0-9]{2})/, "$1");
}

export function formatmmssFixedFn(fractionDigits = 0): (duration: DurationLike) => string {
    return duration => formatmmssFixed(duration, fractionDigits);
}

export function formatHoursFixed(duration: DurationLike, fractionDigits = 0): string {
    return toHours(duration).toFixed(fractionDigits);
}

export function formatHoursFixedFn(fractionDigits = 0): (duration: DurationLike) => string {
    return duration => formatHoursFixed(duration, fractionDigits);
}

export function formatMinutesFixed(duration: DurationLike, fractionDigits = 0): string {
    return toMinutes(duration).toFixed(fractionDigits);
}

export function formatMinutesFixedFn(fractionDigits = 0): (duration: DurationLike) => string {
    return duration => formatMinutesFixed(duration, fractionDigits);
}

export function formatSecondsFixed(duration: DurationLike, fractionDigits = 0): string {
    return toSeconds(duration).toFixed(fractionDigits);
}

export function formatSecondsFixedFn(fractionDigits = 0): (duration: DurationLike) => string {
    return duration => formatSecondsFixed(duration, fractionDigits);
}

export function add(a: DurationLike, b: DurationLike): Duration {
    return fromSeconds(toSeconds(a) + toSeconds(b));
}

export function addFn(b: DurationLike): (a: DurationLike) => Duration {
    return a => add(a, b);
}

export function subtract(a: DurationLike, b: DurationLike): Duration {
    return fromSeconds(toSeconds(a) - toSeconds(b));
}

export function subtractFn(b: DurationLike): (a: DurationLike) => Duration {
    return a => subtract(a, b);
}

export function multiply(duration: DurationLike, scale: number): Duration {
    return fromSeconds(toSeconds(duration) * scale);
}

export function multiplyFn(scale: number): (duration: DurationLike) => Duration {
    return duration => multiply(duration, scale);
}

export function divide(duration: DurationLike, divisor: number): Duration {
    return fromSeconds(toSeconds(duration) / divisor);
}

export function divideFn(divisor: number): (duration: DurationLike) => Duration {
    return duration => divide(duration, divisor);
}

export function roundToSecond(duration: DurationLike): Duration {
    return fromSeconds(Math.round(toSeconds(duration)));
}

export function roundToSeconds(duration: DurationLike, seconds: number): Duration {
    return fromSeconds(Math.round(toSeconds(duration) / seconds) * seconds);
}

export function roundToSecondsFn(seconds: number): (duration: DurationLike) => Duration {
    return duration => roundToSeconds(duration, seconds);
}

export function roundToMinute(duration: DurationLike): Duration {
    return fromMinutes(Math.round(toMinutes(duration)));
}

export function roundToMinutes(duration: DurationLike, minutes: number): Duration {
    return fromMinutes(Math.round(toMinutes(duration) / minutes) * minutes);
}

export function roundToMinutesFn(minutes: number): (duration: DurationLike) => Duration {
    return duration => roundToMinutes(duration, minutes);
}

export function roundToHour(duration: DurationLike): Duration {
    return fromHours(Math.round(toHours(duration)));
}

export function roundToHours(duration: DurationLike, hours: number): Duration {
    return fromHours(Math.round(toHours(duration) / hours) * hours);
}

export function roundToHoursFn(hours: number): (duration: DurationLike) => Duration {
    return duration => roundToHours(duration, hours);
}