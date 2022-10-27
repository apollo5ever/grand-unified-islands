import to from "await-to-js";
import React from "react";
import hex2a from "./hex2a";
import callApi from "./APITest";



export default async function getFundraisers(state,island){

  const deroBridgeApi = state.deroBridgeApiRef.current
  const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
          scid:state.scid,
          code:false,
          variables:true
  }))

  var search= new RegExp(`.*_sm`)
  console.log("search",search)
  var scData = res.data.result.stringkeys

  let fundList= Object.keys(scData)
     .filter(key => search.test(key))
     .map(key=>[hex2a(scData[key]),scData[key.substring(0,key.length-2)+"D"],scData[key.substring(0,key.length-2)+"G"],scData[key.substring(0,key.length-2)+"R"],scData[key.substring(0,key.length-2)+"F"],scData[key.substring(0,key.length-2)+"C"],key.substring(0,key.length-3)])
     
 try{
  try{
    console.log("try localhost")
    const response = await fetch('/islands/fundraisers');
    console.log(response)
    let bounties = await response.json();
  
    if (response.status !== 200) throw Error(bounties.message);
   }
   catch{
    console.log("try 127")
  const response = await fetch('http://127.0.0.1:5000/islands/fundraisers');
  console.log(response)
  let bounties = await response.json();

  if (response.status !== 200) throw Error(bounties.message);
 }}
 catch{
  console.log("try ipfs")
  let bounties = []

  for(let i = 0; i<fundList.length; i++){


      for await (const buf of state.ipfs.cat(fundList[i][0].toString())){
        try{
        let fund = JSON.parse(buf.toString())

    
     bounties.push(fund)
}  catch(error){
   console.log(error)
 }
  
      }

  
}

}
for(let i = 0; i<bounties.length; i++){
  let fund = bounties[i]
  fund.island= fundList[i][6].substring(0,fundList[i][6].length-1)
  fund.index=fundList[i][6].substring(fundList[i][6].length-1)
  fund.deadline = fundList[i][1]
  fund.goal = fundList[i][2]/100000
  fund.raised = fundList[i][3]
  fund.fundee = fundList[i][4]
  fund.claimed = fundList[i][5]
  if(fund.deadline> new Date().getTime()/1000) fund.status=0
  else if(fund.deadline< new Date().getTime()/1000 && fund.goal< fund.raised) fund.status = 1
  else if(fund.deadline<new Date().getTime()/1000 && fund.goal > fund.raised) fund.status = 2

  if(i==bounties.length){
    if(island){
  return( bounties.filter(x=>x.island==island))
}
  else return(bounties)
  }

}


  



 }
