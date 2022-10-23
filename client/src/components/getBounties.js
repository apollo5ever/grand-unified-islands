import to from "await-to-js";
import React from "react";
import hex2a from "./hex2a";
import callApi from "./APITest";



export default async function getBounties(state,island){
  let bounties = []

  const deroBridgeApi = state.deroBridgeApiRef.current
  const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
          scid:state.scid,
          code:false,
          variables:true
  }))

  var search= new RegExp(`.*_bm`)
  
  var scData = res.data.result.stringkeys

  let fundList= Object.keys(scData)
  .filter(key => search.test(key))
  .map(key=>[hex2a(scData[key]),scData[key.substring(0,key.length-2)+"E"],scData[key.substring(0,key.length-2)+"T"],scData[key.substring(0,key.length-2)+"J"],key.substring(0,key.length-3),scData[key.substring(0,key.length-2)+"JN"],scData[key.substring(0,key.length-2)+"JF"]])

 try{
  const response = await fetch('http://127.0.0.1:5000/islands/bounties');
  console.log(response)
   bounties = await response.json();
  console.log(bounties)

  if (response.status !== 200) throw Error(bounties.message);



 }
 catch{
  

  for(let i = 0; i<fundList.length; i++){

   for await (const buf of state.ipfs.cat(fundList[i][0].toString())){
     try{
     let fund = JSON.parse(buf.toString())
     bounties.push(fund)
  

    
    
 } catch(error){
   console.log(error)
 }
  }

  console.log(err)
  console.log(res)
 

  
}

    
}
for(var i=0;i<bounties.length;i++){
 let fund = bounties[i]
  
  if(fund.island!=fundList[i][4].substring(0,fundList[i][4].length-1)) continue 
  fund.index=fundList[i][4].substring(fundList[i][4].length-1)
  fund.expiry = fundList[i][1]
  fund.treasure = fundList[i][2]/100000
  fund.judge = fundList[i][3]
  fund.JN = fundList[i][5]
  fund.JF = fundList[i][6]

  if(fund.JF==2) fund.status=1
  else if(fund.expiry<new Date().getTime()/1000) fund.status=2
  else fund.status=0

  if(i==bounties.length-1){
    if(island){
      return( bounties.filter(x=>x.island==island))
  }
      else return(bounties)
  }
 

}


}

