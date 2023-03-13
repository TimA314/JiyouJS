import * as secp from "@noble/secp256k1";
import { splitByUrl } from './util';


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

export const GetImageFromPost = (content) => {
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    let image = new Image();
    let splitArray = splitByUrl(content);
    if(splitArray.length === 0) return null;

    for (let i = 0; i < splitArray.length; i++){
        if (splitArray[i].includes(validExtensions)){
            image.src = decodeURI(splitArray[i]);
            return image.src;
        }
    }
    return null;
}


export const publishEvent = async (newEvent, pool, relays) => {
    console.log("Event: " + JSON.stringify(newEvent))
    const pubs = await pool.publish(relays, newEvent);
    
    pubs.forEach(pub => {
        pub.on("ok", () => {
            console.log(`Published Event`);
            return "ok";
        })

        pub.on("failed", reason => {
            console.log(reason);
            return "failed";
        })
    })
}

export const isValidKey = (key) => {
    return secp.utils.isValidPrivateKey(key)
}