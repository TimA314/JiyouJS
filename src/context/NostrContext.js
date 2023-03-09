import React from "react";

export const NostrContext = React.createContext({
    privateKey: "",
    publicKey: "",
    relays: [
        "wss://eden.nostr.land",
        "wss://relay.snort.social",
        "wss://relay.nostr.info",
        "wss://relay.snort.social"
      ]
});