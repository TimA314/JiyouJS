import React from "react";
import { generatePrivateKey, getPublicKey } from "nostr-tools";

const pk = generatePrivateKey()
const pubKey = getPublicKey(pk)

export const NostrContext = React.createContext({
    privateKey: pk,
    publicKey: pubKey
});