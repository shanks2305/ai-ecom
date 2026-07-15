export function now(): Date {
    return new Date()
}

export function addMilliseconds(ms: number, from: Date = now()): Date {
    return new Date(from.getTime() + ms)
}

export function addSeconds(seconds: number, from: Date = now()): Date {
    return addMilliseconds(seconds * 1000, from)
}

export function addMinutes(minutes: number, from: Date = now()): Date {
    return addMilliseconds(minutes * 60 * 1000, from)
}

export function addHours(hours: number, from: Date = now()): Date {
    return addMilliseconds(hours * 60 * 60 * 1000, from)
}

export function addDays(days: number, from: Date = now()): Date {
    return addMilliseconds(days * 24 * 60 * 60 * 1000, from)
}
