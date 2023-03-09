import * as secp from "@noble/secp256k1";
import { sha256 as hash } from "@noble/hashes/sha256";
import { bech32 } from "bech32";

export const sha256 = (str) => {
    return secp.utils.bytesToHex(hash(str));
  };

export function bech32ToHex(str) {
    try {
        const nKey = bech32.decode(str, 1_000);
        const buff = bech32.fromWords(nKey.words);
        return secp.utils.bytesToHex(Uint8Array.from(buff));
    } catch {
        return "";
    }
}

export function bech32ToText(str) {
    try {
    const decoded = bech32.decode(str, 1000);
    const buf = bech32.fromWords(decoded.words);
    return new TextDecoder().decode(Uint8Array.from(buf));
    } catch {
    return "";
    }
}

export function getReactions(notes, id, kind) {
    return notes?.filter(a => a.kind === kind && a.tags.some(a => a[0] === "e" && a[1] === id)) || [];
}

export function splitByUrl(str) {
    const urlRegex =
        /((?:http|ftp|https):\/\/(?:[\w+?.\w+])+(?:[a-zA-Z0-9~!@#$%^&*()_\-=+\\/?.:;',]*)?(?:[-A-Za-z0-9+&@#/%=~_|]))/i;
    return str.split(urlRegex);
}