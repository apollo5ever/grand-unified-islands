
import DeroBridgeApi from '../api.js'
import React from 'react'
import ReactDOM from 'react-dom'
import to from 'await-to-js'
import sha256 from 'crypto-js/sha256'
import { useParams,useSearchParams } from 'react-router-dom'

import {LoginContext} from '../LoginProvider';
import Success from './success.js'
import hex2a from './hex2a.js'



export default function BuryTreasure() {

    
    
    const {state, setState} = React.useContext(LoginContext);



const params=useParams()
const [searchParams,setSearchParams] = useSearchParams()
 const island =params.island
 const index = params.index
 const [judges,setJudges]=React.useState([])
 const [execs,setExecs] = React.useState([])
 const [error,setError] = React.useState("")

 const getJudges = React.useCallback(async () =>{
  const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
            scid:state.scid,
            code:false,
            variables:true
    }))

    var search= new RegExp(`.*_j`)  
   
    var scData = res.data.result.stringkeys //.map(x=>x.match(search))
  
  
  const judgeList=Object.keys(scData)
    .filter(key => search.test(key))
    .filter(key=>scData[key]==1||scData[key]==3)
    .map(key=><option value={key.substring(0,key.length-2)}>{key.substring(0,key.length-2)}</option>)
    
  setJudges(judgeList)
    
  const execList=Object.keys(scData)
  .filter(key => search.test(key))
  .filter(key=>scData[key]==2||scData[key]==3)
  .map(key=><option value={key.substring(0,key.length-2)}>{key.substring(0,key.length-2)}</option>)
  
setExecs(execList)

})


React.useEffect(() => {
  getJudges()
    
  },[state])



  const DoIt = React.useCallback(async (event) => {
    event.preventDefault();
    if(!event.target.bountyName.value){
      setError("Bounty name is required.")
      return
    }
    if(!event.target.expiry.value){
      setError("Expiry is required.")
      return
    }


    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err0, res0] = await to(deroBridgeApi.daemon('get-sc', {
            scid:state.scid,
            code:false,
            variables:true
    }))
    var executer = event.target.executer.value
  
    if(executer=="self")executer=event.target.island.value

    var judge = event.target.judge.value
    if(judge=="self")judge=event.target.island.value
    



 

    
    var burn = 100
    
    var expiry = new Date(event.target.expiry.value).getTime()/1000 + new Date().getTimezoneOffset()*60
    if(expiry<new Date().getTime()/1000){
      setError("Expiry must be future date")
      return
    } 

    var obj = {
      "name": event.target.bountyName.value,
      "expiry": expiry,
      "tagline": event.target.tagline.value,
      "index": index,
      "description": event.target.description.value,
      "image":event.target.bountyPhoto.value,
      "island":island,
    
      

    }

    var data = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 0
      },
      "pinataMetadata": {
        "name": island+" buried treasure "+index+" "+event.target.bountyName.value,
        "keyvalues": {
        }
      },
      "pinataContent": obj
    });


 

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json','authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNjc5NzU5MS02OGUxLTQyNzAtYjZhMy01NjBjN2Y3M2IwYTMiLCJlbWFpbCI6ImJhY2tlbmRAYW1icm9zaWEubW9uZXkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDgzZTJkMGQ2Yzg2YTBhNjlkY2YiLCJzY29wZWRLZXlTZWNyZXQiOiJlN2VlMTE4MWM2YTBlN2FmNjQ0YmUzZmEyYmU1ZWY5ZWFmMmNmMmYyYzc0NWQzZGIxNDdiMThhOTU5NWMwZDNlIiwiaWF0IjoxNjYxMTk1NjUxfQ.9Pz2W_h7zCiYyuRuVySKcDwA2fl_Jbm6QDulihAIpmo`
     },
      
            body:  data
    });

    const addObj= await state.ipfs.add(JSON.stringify(obj).toString())
    const metadata =addObj.cid.toString()
    console.log(addObj)
    console.log(metadata)

    var transfers = []
    if(state.cocoBalance<burn){
      transfers.push({
        "destination":state.randomAddress,
        "burn":parseInt(event.target.treasure.value*100000+10000)

      })
    }else{
      transfers.push( {
        "scid": state.coco,
        "burn": burn
      },{
        "destination":state.randomAddress,
        "burn":parseInt(event.target.treasure.value*100000)

      })
    }
    



   
    let j=parseInt(state.myIslands.filter(x=>x.name=island)[0].j)
  
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
      "scid": state.scid,
      "ringsize": 2,
      "transfers": transfers,
      "sc_rpc": [{
        "name": "entrypoint",
        "datatype": "S",
        "value": "BT"
      },

      {
        "name": "H",
        "datatype": "S",
        "value": island
      },
      {
        "name": "i",
        "datatype": "U",
        "value": parseInt(index)
      },
      {
        "name": "J",
        "datatype": "S",
        "value": event.target.judge.value
      },
      {
        "name":"X",
        "datatype":"S",
        "value":event.target.executer.value
      },
      {
        "name": "E",
        "datatype": "U",
        "value": expiry
      },
      {
        "name": "M",
        "datatype": "S",
        "value": "M"
      },
     
      {
        "name": "m",
        "datatype" : "S",
        "value": metadata
      },
      {
        "name":"j",
        "datatype":"U",
        "value":j
      }
      ]
    }))


    console.log(err)
    console.log(res)


    const judgeAddress=hex2a(res0.data.result.stringkeys[`${event.target.judge.value}_O`])
    const executerAddress=hex2a(res0.data.result.stringkeys[`${event.target.executer.value}_O`])
    const [err3,res3] =await to(deroBridgeApi.wallet('start-transfer',{
      "ringsize":2,
      "transfers":[
      {"destination":judgeAddress,
      "amount":1,
          
      "payload_rpc":[
              {
                      "name": "C",
                      "datatype": "S",
                      "value": "You have been nominated for bounty judge by: " +island
              }]
              },
              
                {"destination":executerAddress,
                "amount":1,
                    
                "payload_rpc":[
                        {
                                "name": "C",
                                "datatype": "S",
                                "value": "You have been nominated for bounty executer by: " +island
                        }]
                        }]

    }))

   



  setSearchParams({"status":"success"})

  })



  return (
    <div className="function">
{ searchParams.get("status")=="success"?<Success/>
:     <div className="profile">
      
      <h3>Bury Treasure</h3>
      <p>When you bury treasure on your private island, you are creating a bounty for some specific goal. Specify the criteria for release of treasure, and appoint a judge (it can be you) to decide when that criteria has been met.</p>
      <p>This will cost 100 coco. If you don't have enough coco you will be charged 0.1 Dero instead,</p>
      
      <form onSubmit={DoIt}>
      <input placeholder="Buried Treasure Name" id="bountyName"/>
        <input placeholder="Image URL" id="bountyPhoto"/>
        <input placeholder="Tagline" id="tagline"/>
        <p>Expiry (if the task isn't complete before this date, supporters can retrieve their funds)</p>
        <input type="date" id="expiry" name="expiry"></input>
        
        <textarea placeholder="Description" rows="44" cols="80" id="description"/>
        <input placeholder="Initial Treasure (Dero Amount)" id="treasure" type="text" />
        <p>Nominate a Judge. This person sorts through treasure claims and chooses who is entitled to the funds. The judge is paid 10% of the treasure for this work. Backup judges can be nominated later.</p>
        <select id="judge">{judges}</select>
        <p>Nominate an Executer. This person releases the treasure according to the judge's judgement, or he may veto the decision if he believes it to be in error. He is not paid. Backup executers can be nominated later.</p>
        <select id="executer">{execs}</select>
        
        <button type={"submit"}>Create</button>
      </form>
      {error}
    </div>}
    </div>
  )
}
