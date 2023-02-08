
import DeroBridgeApi from '../api.js'
import React, {useContext} from 'react'
import ReactDOM from 'react-dom'
import to from 'await-to-js'
import sha256 from 'crypto-js/sha256'


export default function CreateFund() {

  const {state} = useContext(LoginContext);

  const DoIt = React.useCallback(async (event) => {
    event.preventDefault();

    
     
      const deroBridgeApi = state.deroBridgeApiRef.current
      const [err0, res0] = await to(deroBridgeApi.daemon('get-sc', {
              scid:state.scid,
              code:false,
              variables:true
      }))
    
   
      
 
 
 
      var search= sha256(event.target.island.value).toString()+"_O"
      console.log("search",search)
      var owner = res0.data.result.stringkeys[search]
      console.log(owner)


    var index = 0
    var burn = 100
    if(!owner){
       burn = 1000
       
    }else{
      var search2= new RegExp(`${sha256(event.target.island.value).toString()}.*_sm`)
      console.log(search2)
      let fundList = Object.keys(res0.data.result.stringkeys)
      .filter(key => search2.test(key))
      console.log(fundList)
      index = fundList.length
    }
    var deadline = new Date(event.target.deadline.value).getTime()/1000
    console.log("DATE",deadline)

    var obj = {
      "name": event.target.fundName.value,
      "goal": event.target.goal.value,
      "deadline": deadline,
      "tagline": event.target.tagline.value,
      "index": index,
      "description": event.target.description.value,
      "image":event.target.fundPhoto.value,
      "island":event.target.island.value
      

    }


  

    var data = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 0
      },
      "pinataMetadata": {
        "name": event.target.island.value+" smoke signal "+index+" "+event.target.fundName.value,
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

    console.log(response)
 
    
      console.log("fund id",await state.ipfs.id())
     const addObj= await state.ipfs.add(JSON.stringify(obj).toString())
     const metadata =addObj.cid.toString()
     console.log(addObj)
     console.log(metadata)
 
    

     var transfers = []
     if(state.cocoBalance<burn){
       transfers.push({
         "destination":state.randomAddress,
         "burn":burn*100
 
       })
     }else{
       transfers.push( {
        "destination":state.randomAddress,
         "scid": state.coco,
         "burn": burn
       })
     }

   
  
    
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
      "scid": state.scid,
      "ringsize": 2,
      "transfers": transfers,
      "sc_rpc": [{
        "name": "entrypoint",
        "datatype": "S",
        "value": "NF"
      },

      {
        "name": "G",
        "datatype": "U",
        "value": parseInt(event.target.goal.value) * 100000
      },
      {
        "name": "D",
        "datatype": "U",
        "value": deadline
      },
      {
        "name": "A",
        "datatype": "S",
        "value": event.target.address.value
      },
      {
        "name": "H",
        "datatype": "S",
        "value": sha256(event.target.island.value).toString()
      },
      {
        "name": "i",
        "datatype": "U",
        "value": index
      },
      {
        "name": "M",
        "datatype" : "S",
        "value": "m"
      },
      {
        "name": "m",
        "datatype" : "S",
        "value": metadata
      }
      ]
    }))


    console.log(err)
    console.log(res)

   



  

  })



  return (
    <div className="function">
      <div className="profile">
      
      
      
      <h3>Add a Smoke Signal</h3>
      <p>If you already own an island, adding a smoke signal costs 1 Coco. Please ensure island name matches exactly, or it will be considered fraudulent and won't be displayed. If you don't already have an island, this will create one for you and it will cost you 10 Coco.</p>
      <form onSubmit={DoIt}>
        <input placeholder="Island (case-sensitive)" id="island" type="text" />
        <input placeholder="Name" id="fundName" type="text" />
        <input placeholder="Image URL" id="fundPhoto" type="text"/>
        <input placeholder="Tagline" id="tagline" type="text" />
        <p>Deadline</p>
        <input type="date" id="deadline" name="deadline"></input>
        
        <textarea placeholder="Description" rows="44" cols="80" id="description"/>
        <input placeholder="Goal" id="goal" type="text" />
        <input placeholder="Address" id="address" type="text" />
        <button type={"submit"}>Create</button>
      </form>
    </div>
    </div>
  )
}
