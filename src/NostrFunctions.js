import * as secp from "@noble/secp256k1";


export const loadProfile = async (pool, relays, pubkey) => {
    let profile = await pool.list(relays, [{kinds: [0], authors: [pubkey], limit: 1 }]);
        return profile;
}

export const setUserFollowers = async (pool, pubkey, relays) => {
    let contactsEvent = await pool.list(relays, [{kinds: [3], authors: [pubkey], limit: 1 }])
    let followersPubKeys = new Set();
    if(contactsEvent && contactsEvent.tags){
        contactsEvent.tags.foreach((tag) => {
            if (tag[0][0] === "p" && secp.utils.isValidPrivateKey(tag[0][2])){
                followersPubKeys.add(tag[0][2]);
            }
        })
        
        return followersPubKeys;
    }

    return null;  
}

export const isValidKey = (key) => {
    return secp.utils.isValidPrivateKey(key)
}