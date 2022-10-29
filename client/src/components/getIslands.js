import to from "await-to-js";
import React from "react";
import hex2a from "./hex2a";
import callApi from "./APITest";



export default async function getIslands(state,i){

 try{

  try{
    console.log("trying localhost")
    //  console.log("call api response",await callApi())
    //  var islands = await callApi()
     const response = await fetch('/api/islands');
     console.log(response)
     const islands = await response.json();
   
     if (response.status !== 200) throw Error(islands.message);
  
   if(i){
      return( islands.filter(x=>x.name==i))
  }
      else return(islands)
  
   }catch{
    console.log("trying 127")
  //  console.log("call api response",await callApi())
  //  var islands = await callApi()
   const response = await fetch('http://127.0.0.1:5000/islands');
   console.log(response)
   const islands = await response.json();
 
   if (response.status !== 200) throw Error(islands.message);

 if(i){
    return( islands.filter(x=>x.name==i))
}
    else return(islands)

 }}
 catch{

  console.log("trying ipfs")


console.log("state",state)
console.log("i",i)   
        var islands=[]
        var res
        var scData
        
      
       
        if(state.deroBridgeApiRef){
          const deroBridgeApi = state.deroBridgeApiRef.current
        let [err, res] = await to(deroBridgeApi.daemon('get-sc', {
                scid:state.scid,
                code:false,
                variables:true
        }))
         scData = res.data.result.stringkeys 
      }else {
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

        // console.log("res",res)
        // const body = await res.json()
        // console.log("explore",JSON.stringify(body));
          
      }
      var search
      if(i){
        search = new RegExp(`${i}_M`)

      }else{
        search= new RegExp(`.*_M`)
      }
        
        
        
   
       let islandList= Object.keys(scData)
        .filter(key => search.test(key))
        .map(key=>hex2a(scData[key]))
        
       console.log("islandList",islandList)
        
        for(let i = 0; i<islandList.length; i++){
     
         for await (const buf of state.ipfs.cat(islandList[i].toString())){
           
          try{
            let island = JSON.parse(buf.toString())
           console.log(island)
           islands.push(island)
           console.log(islands)
          }catch{
            if(i){
              return( islands.filter(x=>x.name==i))
          }
              else return(islands)
          }
         }
        }
        
   console.log("islands final",islands)
if(i){
    return( islands.filter(x=>x.name==i))
}
    else return(islands)
    
}
}

