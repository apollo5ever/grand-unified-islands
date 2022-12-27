
import DeroBridgeApi from '../api.js'
import React from 'react'
import ReactDOM from 'react-dom'
import to from 'await-to-js'
import { useParams,useSearchParams } from 'react-router-dom'



import {LoginContext} from '../LoginProvider';
import Success from './success.js'


export default function CreateFund() {

    
    
    const {state, setState} = React.useContext(LoginContext);
    const [searchParams,setSearchParams] = useSearchParams()

    const params=useParams()
const island=params.island
const index = params.index


 



  const DoIt = React.useCallback(async (event) => {
    event.preventDefault();

    
     
      const deroBridgeApi = state.deroBridgeApiRef.current
      const [err0, res0] = await to(deroBridgeApi.daemon('get-sc', {
              scid:state.scid,
              code:false,
              variables:true
      }))
    
   
      
 
 
 
   

    
    var burn = 100
    
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
      "island":island
      

    }


  

    var data = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 0
      },
      "pinataMetadata": {
        "name": island+" smoke signal "+index+" "+event.target.fundName.value,
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

     let j=state.myIslands.filter(x=>x.name=island)[0].j
 
    

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
        "value": island
      },
      {
        "name": "i",
        "datatype": "U",
        "value": parseInt(index)
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

   



  setSearchParams({"status":"success"})

  })



  return (
    <div className="function">
{    searchParams.get("status")=="success"?<Success/>:  <div className="profile">
      
      
      
      <h3>Add a Smoke Signal</h3>
      <p>This will cost 100 coco. If you don't have enough coco you will be charged 0.1 Dero instead.</p>
      <form onSubmit={DoIt}>
        
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
    </div>}
    </div>
  )
}
