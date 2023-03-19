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
    const decoded = bech32.decode(str);
    const buf = bech32.fromWords(decoded.words);
    return new TextDecoder().decode(Uint8Array.from(buf));
    } catch {
    return "";
    }
}

export function parseKey(key){
    if (typeof key === "string") {
        // Is the key encoded in bech32?
        if (key.startsWith("npub1")) {
          const { words } = bech32.decode(key)
          const bytes = Uint8Array.from(bech32.fromWords(words))
          return secp.utils.bytesToHex(bytes).toLowerCase()
        }
        // If not, it must be lowercase hex.
        const valid = "0123456789abcdef"
        if (key.length % 2 !== 0) {
            return "";
        }
        for (const c of key) {
          if (!valid.includes(c)) {
            return "";
          }
        }
        return key
      } else {
        return secp.utils.bytesToHex(key).toLowerCase()
      }
}

export function getReactions(notes, id, kind) {
    return notes?.filter(a => a.kind === kind && a.tags.some(a => a[0] === "e" && a[1] === id)) || [];
}

export function splitByUrl(str) {
  if (!str) return null;
    const urlRegex =
        /((?:http|ftp|https):\/\/(?:[\w+?.\w+])+(?:[a-zA-Z0-9~!@#$%^&*()_\-=+\\/?.:;',]*)?(?:[-A-Za-z0-9+&@#/%=~_|]))/i;
    return str.split(urlRegex)[0];
}

export function sortEvents(newEvents, followerArray) {
  if (!newEvents) return newEvents;
  
  const sortedEvents = newEvents.slice().sort((a, b) => b.created_at - a.created_at)
const mappedEvents = sortedEvents.map((e) => {
  const isFollowing = Array.isArray(followerArray) && followerArray.some(followPk => followPk === e.pubkey);
  return { ...e, isFollowing };
});
  
  console.log(mappedEvents)
  return mappedEvents;
}

export const DiceBears = () => {
  let dicebearArray = [
    "https://api.dicebear.com/5.x/bottts/svg?seed=Bubba&mouth=smile01,smile02&sides=antenna01,cables01,cables02,round,square,squareAssymetric&top=antenna,antennaCrooked,glowingBulb01,glowingBulb02,lights,radar,bulb01",
    "https://api.dicebear.com/5.x/bottts/svg?seed=Snowball&mouth=smile01,smile02&sides=antenna01,cables01,cables02,round,square,squareAssymetric&top=antenna,antennaCrooked,glowingBulb01,glowingBulb02,lights,radar,bulb01",
    "https://api.dicebear.com/5.x/bottts/svg?seed=Baby&mouth=smile01,smile02&sides=antenna01,cables01,cables02,round,square,squareAssymetric&top=antenna,antennaCrooked,glowingBulb01,glowingBulb02,lights,radar,bulb01",
    "https://api.dicebear.com/5.x/bottts/svg?seed=Misty&mouth=smile01,smile02&sides=antenna01,cables01,cables02,round,square,squareAssymetric&top=antenna,antennaCrooked,glowingBulb01,glowingBulb02,lights,radar,bulb01",
    "https://api.dicebear.com/5.x/bottts/svg?seed=Missy&mouth=smile01,smile02&sides=antenna01,cables01,cables02,round,square,squareAssymetric&top=antenna,antennaCrooked,glowingBulb01,glowingBulb02,lights,radar,bulb01",
    "https://api.dicebear.com/5.x/bottts/svg?seed=Pumpkin&mouth=smile01,smile02&sides=antenna01,cables01,cables02,round,square,squareAssymetric&top=antenna,antennaCrooked,glowingBulb01,glowingBulb02,lights,radar,bulb01",
    "https://api.dicebear.com/5.x/bottts/svg?seed=Simon&mouth=smile01,smile02&sides=antenna01,cables01,cables02,round,square,squareAssymetric&top=antenna,antennaCrooked,glowingBulb01,glowingBulb02,lights,radar,bulb01",
    "https://api.dicebear.com/5.x/bottts/svg?seed=Cookie&mouth=smile01,smile02&sides=antenna01,cables01,cables02,round,square,squareAssymetric&top=antenna,antennaCrooked,glowingBulb01,glowingBulb02,lights,radar,bulb01",
    "https://api.dicebear.com/5.x/bottts/svg?seed=Lucky&mouth=smile01,smile02&sides=antenna01,cables01,cables02,round,square,squareAssymetric&top=antenna,antennaCrooked,glowingBulb01,glowingBulb02,lights,radar,bulb01"
  ]

  return dicebearArray[Math.floor(Math.random() * dicebearArray.length)]
}