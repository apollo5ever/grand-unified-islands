import React from 'react'
import ReactDOM from 'react-dom'
import { LoginContext } from '../LoginContext';
import {useParams,useSearchParams} from 'react-router-dom'
import CryptoJS, { x64 } from 'crypto-js';
import to from 'await-to-js';
import Success from './success';




export default function PublishPost(){

  const [state, setState] = React.useContext(LoginContext);
  const params=useParams() 
  const [tierList,setTierList]=React.useState([]) 
  const [searchParams,setSearchParams]=useSearchParams()


  const getIsland = async () => {
    
  setTierList(state.myIslands[state.active].tiers.map(x=>
    <li>
      <div className="tierList">
       <label for={`tier_${x.index}`}>{x.name}</label> 
    <input id={`tier_${x.index}`} type="checkbox"  />
    
    </div>
</li>
  ))
   
   
  }
  



 const handleSubmit = async e => {
    e.preventDefault()

    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err0, res0] = await to(deroBridgeApi.daemon('get-sc', {
            scid:state.scid,
            code:false,
            variables:true
    }))
    var scData = res0.data.result.stringkeys

    let supporterList=[]

    for(var i=0;i<tierList.length;i++){
      var check = `tier_${i}`
      
      if(!e.target[check].checked) continue
      var supporterSearch = new RegExp(state.myIslands[state.active].name+i+`_E`)
      
      let subs = Object.keys(scData)
    .filter(key=>supporterSearch.test(key))
    .filter(key=>scData[key]> new Date().getTime()/1000)
    .map(x=>x.substring(0,66))

     for(var s of subs) supporterList.push(s)
    }
  
  
    //var supporterSearch = new RegExp(`.*_\\${params.island+e.target.tier.value}\_E`)
  
    
     //.map(x=>x.match(search))
  


    const post = {
      title:e.target.title.value,
      brief:e.target.brief.value,
      content:e.target.content.value,
      comments:[]
  }
  const key = CryptoJS.lib.WordArray.random(32).toString()
  console.log(key)

  const encryptedPost = CryptoJS.AES.encrypt(JSON.stringify(post),key).toString()
console.log(encryptedPost)
    var postData = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 0
      },
      "pinataMetadata": {
        "name": params.island,
        "keyvalues": {
        }
      },
      "pinataContent": encryptedPost
    });

    const islandPinata = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json','authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNjc5NzU5MS02OGUxLTQyNzAtYjZhMy01NjBjN2Y3M2IwYTMiLCJlbWFpbCI6ImJhY2tlbmRAYW1icm9zaWEubW9uZXkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDgzZTJkMGQ2Yzg2YTBhNjlkY2YiLCJzY29wZWRLZXlTZWNyZXQiOiJlN2VlMTE4MWM2YTBlN2FmNjQ0YmUzZmEyYmU1ZWY5ZWFmMmNmMmYyYzc0NWQzZGIxNDdiMThhOTU5NWMwZDNlIiwiaWF0IjoxNjYxMTk1NjUxfQ.9Pz2W_h7zCiYyuRuVySKcDwA2fl_Jbm6QDulihAIpmo`
     },
      
            body:  postData
    });

    
    const addPost= await state.ipfs.add(JSON.stringify(encryptedPost).toString())
    const M =addPost.cid.toString()

    supporterList=supporterList.map(x=>new Object({
      "destination":x,
      "amount":1,
      "payload_rpc":[{
              "name": "key",
              "datatype": "S",
              "value": key
      },
      {
        "name":"cid",
        "datatype":"S",
        "value":M
      }
]
      }))
/*
    let supporterList = Object.keys(scData)
    .filter(key=>supporterSearch.test(key))
    .filter(key=>scData[key]> new Date().getTime()/1000)
    .map(x=>new Object({
      "destination":x.substring(0,66),
      "amount":1,
      "payload_rpc":[{
              "name": "key",
              "datatype": "S",
              "value": key
      },
      {
        "name":"cid",
        "datatype":"S",
        "value":M
      }
]
      }))
*/
     // console.log(supporterList,new Date().getTime()*1000)


   
    
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {

       "ringsize": 16,
      "transfers":supporterList,
      
      
     
   
  }))
 
   
    
setSearchParams({"status":"success"})
};



  

 
  React.useEffect(()=>{
    
    getIsland()
  },[])

    return(
        <div className="function">
   {searchParams.get("status")=="success"?<Success/> :   <div>
        
    
    <form onSubmit={handleSubmit}>
      <ul>{tierList}</ul>
        <input placeholder="title" id="title" type="text"/>
        <input placeholder="teaser/tagline" id="brief" type="text"/>
    <textarea placeholder="Write your masterpiece" rows="44" cols="80" id="content">
</textarea>

      <button type={"submit"}>Publish</button>
    </form>

    </div>
    }

        </div>
    )
}