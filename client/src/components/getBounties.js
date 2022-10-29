import to from "await-to-js";
import React from "react";
import hex2a from "./hex2a";
import callApi from "./APITest";



export default async function getBounties(state,island){
  let bounties = []
  var scData

if(state.deroBridgeApiRef) { 
  const deroBridgeApi = state.deroBridgeApiRef.current
  const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
          scid:state.scid,
          code:false,
          variables:true
  }))
  scData = res.data.result.stringkeys
}else{
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
 let res =await fetch(`https://dero-node.mysrv.cloud/json_rpc`, {
    method: 'POST',
   
    body: data,
    headers: {'Content-Type': 'application/json' }
  })
  console.log(res)
  let body = await res.json()
  console.log(body)
  scData = body.result.stringkeys

}

  var search= new RegExp(`.*_bm`)
  
  

  let fundList= Object.keys(scData)
  .filter(key => search.test(key))
  .map(key=>[hex2a(scData[key]),scData[key.substring(0,key.length-2)+"E"],scData[key.substring(0,key.length-2)+"T"],scData[key.substring(0,key.length-2)+"J"],key.substring(0,key.length-3),Object.keys(scData).filter(key2=>new RegExp(`${island+key.substring(key.length-4,key.length-3)}*_J[0-9]`).test(key2)),scData[key.substring(0,key.length-2)+"JN"],scData[key.substring(0,key.length-2)+"JE"],scData[key.substring(0,key.length-2)+"JT"],Object.keys(scData).filter(key3=>new RegExp(`${island+key.substring(key.length-4,key.length-3)}*_X[0-9]`).test(key3)),scData[key.substring(0,key.length-2)+"XN"],scData[key.substring(0,key.length-2)+"XE"],scData[key.substring(0,key.length-2)+"XT"],scData[key.substring(0,key.length-2)+"X"],Object.keys(scData).filter(key4=>new RegExp(`${island+key.substring(key.length-4,key.length-3)}*_R_[0-9]`).test(key4)),Object.keys(scData).filter(key5=>new RegExp(`\\${island+key.substring(key.length-4,key.length-3)}\*_W_[0-9]`).test(key5)),scData[key.substring(0,key.length-2)+"JF"]])

 try{
  try{
    console.log("try localhost")
    const response = await fetch('/api/islands/bounties');
    console.log(response)
     bounties = await response.json();
    console.log(bounties)
  
    if (response.status !== 200) throw Error(bounties.message);
  
  
  
   }
   catch{
    console.log("try 127")
  const response = await fetch('http://127.0.0.1:5000/islands/bounties');
  console.log(response)
   bounties = await response.json();
  console.log(bounties)

  if (response.status !== 200) throw Error(bounties.message);



 }}
 catch{
  console.log("try ipfs")
  console.log(fundList)

  for(let i = 0; i<fundList.length; i++){

   for await (const buf of state.ipfs.cat(fundList[i][0].toString())){
     try{
     let fund = JSON.parse(buf.toString())
     bounties.push(fund)
  

    
    
 } catch(error){
   console.log(error)
 }
  }

 
 

  
}

    
}
console.log(bounties)
for(var i=0;i<bounties.length;i++){
 let fund = bounties[i]
  
 if(fund.island!=fundList[i][4].substring(0,fundList[i][4].length-1)) continue
       
 fund.index=fundList[i][4].substring(fundList[i][4].length-1)
 fund.expiry = fundList[i][1]
 fund.treasure = fundList[i][2]/100000
 if(fundList[i][3]) {
   fund.judge = hex2a(fundList[i][3])
   fund.judgeAddress=hex2a(scData[`${fund.judge}_O`])
 }
 fund.judgeList=[]
 fund.JN= parseInt((fundList[i][6] + 1+(new Date().getTime()/1000 - fundList[i][7])/1209600)%fundList[i][8])
 if(new Date().getTime()/1000>fundList[i][7])
 {fund.JE = Math.round(1209600-(new Date().getTime()/1000-fundList[i][7])%1209600)
}else fund.JE = Math.round(fundList[i][7]-new Date().getTime()/1000)
 for(var k=0;k<fundList[i][5].length;k++)
 {fund.judgeList.push(hex2a(scData[fundList[i][5][k]]))}

 if(fundList[i][13])fund.executer = hex2a(fundList[i][13])
 fund.executerList=[]
 fund.XN= parseInt((fundList[i][10] + 1+(new Date().getTime()/1000 - fundList[i][11])/1209600)%fundList[i][12])
 if(new Date().getTime()/1000>fundList[i][7])
 {fund.XE = Math.round(1209600-(new Date().getTime()/1000-fundList[i][11])%1209600)
}else fund.XE = Math.round(fundList[i][11]-new Date().getTime()/1000)


 //fund.XE = Math.round(300-(new Date().getTime()/1000-fundList[i][11])%300)
 //fund.tXE = fundList[i][11]
 for(var k=0;k<fundList[i][9].length;k++)
 {fund.executerList.push(hex2a(scData[fundList[i][9][k]]))}
 fund.recipientList=[]
 for(var k=0;k<fundList[i][14].length;k++){
   fund.recipientList.push(hex2a(scData[fundList[i][14][k]]))
 }
 fund.weightList=[]
 fund.weightSum=0
 for(var k=0;k<fundList[i][15].length;k++){
   fund.weightSum += scData[fundList[i][15][k]]
   fund.weightList.push(scData[fundList[i][15][k]])
 }
 fund.weightList = fund.weightList.map(x=><>weight: {x} ({Math.round(100*x/fund.weightSum)}%)</>)
 fund.recipientList = fund.recipientList.map((x,i)=><li>{x} {fund.weightList[i]}</li>)
 fund.JF = fundList[i][16]
 if(fund.expiry> new Date().getTime()/1000 && fund.JF!=2) fund.status=0
 else if(fund.JF==2) fund.status=1
 else if(fund.expiry<new Date().getTime()/1000&&fund.JF!=2) fund.status=2

  if(i==bounties.length-1){
    if(island){
      console.log("filtered by island ",island)
      console.log(bounties.filter(x=>x.island==island))
      return( bounties.filter(x=>x.island==island))
  }
      else return(bounties)
  }
 

}


}

