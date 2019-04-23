import isInteger = require("is-integer");
import {isIntegerInRange, isNonNegativeFinite} from "./util";

/** A length of time. */
export interface Duration {
    hours: number;
    minutes: number;
    seconds: number;
}

export function isValid(duration: Readonly<Partial<Duration>>): boolean {
    const hours = duration.hours == null ? 0 : duration.hours;
    const minutes = duration.minutes == null ? 0 : duration.minutes;
    const seconds = duration.seconds == null ? 0 : duration.seconds;

    return isNonNegativeFinite(hours)
        && isNonNegativeFinite(minutes)
        && isNonNegativeFinite(seconds);
}

export function validate(duration: Readonly<Partial<Duration>>): void {
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

export function normalize(duration: Readonly<Partial<Duration>>): Duration {
    return fromSeconds(toSeconds(duration));
}

export function toSeconds(duration: Readonly<Partial<Duration>>): number {
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