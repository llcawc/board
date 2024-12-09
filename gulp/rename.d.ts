/**
 * Rename file - change extname or/and added suffix
 * @type { function rename({ extname?: string | null; suffix?: string | null }) }
 */
export default function rename({ extname, suffix, }?: {
    extname?: string | null;
    suffix?: string | null;
}): import("stream").Transform;
