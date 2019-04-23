import isInteger = require("is-integer");
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

        return {hours, minutes, seconds};
    }
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