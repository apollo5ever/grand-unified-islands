import to from "await-to-js";
import React from "react";
import Subscribe from "./subscribe";


export default async function getMIB(island,index,state){
    

    console.log("island",island)
    console.log("index",index)
   console.log("state",state)
    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
            scid:state.scid,
            code:false,
            variables:true
    }))
    var bottleSearch = new RegExp(island.name+`\\d*_Av`)
    var scData = res.data.result.stringkeys

    let tierList = Object.keys(scData)
    .filter(key=>bottleSearch.test(key))  
    .map(key=><Subscribe profile={island.name} name={island.tiers[key.substring(key.length-4,key.length-3)].name} index={key.substring(key.length-4,key.length-3)} perks={island.tiers[key.substring(key.length-4,key.length-3)].perks} amount={scData[key.substring(0,key.length-2)+"Am"]} interval={scData[key.substring(0,key.length-2)+"I"]} userAddress={state.userAddress} dba={state.deroBridgeApiRef} scid={state.scid} randomAddress={state.randomAddress}/>)
  
if(index==-1){
    return(tierList)
}
    else return(tierList[index])
}