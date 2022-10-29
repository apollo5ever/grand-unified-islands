import to from "await-to-js";
import React from "react";
import Subscribe from "./subscribe";


export default async function getMIB(island,index,state){
    var bottleSearch = new RegExp(island.name+`\\d*_Av`)
    var scData

    console.log("island",island)
    console.log("index",index)
   console.log("state",state)
   if(state.deroBridgeApiRef){ 
    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
            scid:state.scid,
            code:false,
            variables:true
    }))
    
    scData = res.data.result.stringkeys
}
else{
    const data = JSON.stringify({
        "jsonrpc": "2.0",
        "id": "1",
        "method": "DERO.GetSC",
        "params": {
          "scid": "ce99faba61d984bd4163b31dd4da02c5bff32445aaaa6fc70f14fe0d257a15c3",
          "code": false,
          "variables": true
        }
      });
     let res =await fetch(`https://dero-api.mysrv.cloud/json_rpc`, {
        method: 'POST',
       
        body: data,
        headers: {'Content-Type': 'application/json' }
      })
      console.log(res)
      let body = await res.json()
      console.log(body)
      scData = body.result.stringkeys
}

    let tierList = Object.keys(scData)
    .filter(key=>bottleSearch.test(key))  
    .map(key=><Subscribe profile={island.name} name={island.tiers[key.substring(key.length-4,key.length-3)].name} index={key.substring(key.length-4,key.length-3)} perks={island.tiers[key.substring(key.length-4,key.length-3)].perks} amount={scData[key.substring(0,key.length-2)+"Am"]} interval={scData[key.substring(0,key.length-2)+"I"]} userAddress={state.userAddress} dba={state.deroBridgeApiRef} scid={state.scid} randomAddress={state.randomAddress} available={scData[key.substring(0,key.length-2)+"Av"]}/>)
  
if(index==-1){
    return(tierList)
}
    else return(tierList[index])
}