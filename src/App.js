import {
  generatePrivateKey,
  relayInit, 
  getPublicKey,
  SimplePool,
  validateEvent,
  verifySignature,
  signEvent,
  getEventHash
} from 'nostr-tools'
import { useEffect, useState } from 'react';
import './App.css';
import ActionAreaCard from './components/card';

function App() {
  const [events, setEvents ] = useState([]);
  let relays = ['wss://nos.lol', 'wss://relay.damus.io', 'wss://nostr.mom']
  // let privateKey = generatePrivateKey() // `sk` is a hex string
  // // console.log("pk", privateKey)
  // let publicKey = getPublicKey(privateKey) // `pk` is a hex string
  // console.log("publicKey:", publicKey)

  useEffect(()=> {
    async function start(){
      const pool = new SimplePool()


      let events = await pool.list(relays, [{kinds: [1]}])
      setEvents(events);
      console.log(events);
    }
    start();
    
  },[]);
  
  if(events !== []){
    return (
      <div className="App">
        {events.map((event) => (
            <ActionAreaCard key={event.id} event={event} relays={relays}/>
        ))}
      </div>
    )
  }
  else {
    return <div></div>
  }
}

export default App;
