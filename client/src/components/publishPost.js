import React, {useContext} from 'react'
import {LoginContext} from '../LoginProvider';
import {useParams,useSearchParams} from 'react-router-dom'
import CryptoJS, { x64 } from 'crypto-js';
import to from 'await-to-js';
import Success from './success';




export default function PublishPost(){
  const {state} = useContext(LoginContext);
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




    
    // const addPost= await state.ipfs.add(JSON.stringify(encryptedPost).toString())
    // const M =addPost.cid.toString()

    // var postData = JSON.stringify({
    //   "cid":M,
    //   "name":`${params.island}_mib`
    // });

    // const islandPinata = await fetch('https://api.filebase.io/v1/ipfs/pins', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json','authorization': `Bearer QzczQTJBNURDNTc1NUM3NUMzMTM6RTh4RDJVQkgzMldXenhmZ1JaMGtHU2FKaG4zYmR5R1JtSXEzMlowdDpwcml2YXRlaXNsYW5kcw==`
    //  },
      
    //         body:  postData
    // });


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
     const fee = encryptedPost.length*3

     const [err1, res1] = await to(deroBridgeApi.wallet('start-transfer', {

      "scid": "8088b0089725de1d323276a0daa1f25cfab9c0b68ccb9318cbf6bf83f5a127c1",
    	"ringsize": 2,
      
    	"sc_rpc": [{
    		"name": "entrypoint",
    		"datatype": "S",
    		"value": "StoreKeyString"
    	},
    	{
    		"name": "k",
    		"datatype": "S",
    		"value": `private.islands.${params.island}_${Date.now()}`
    	},
        {
            "name": "v",
            "datatype" : "S",
            "value" :`00000${encryptedPost}00000`
        }]
     
     
    
  
 }))
 console.log(res1.data.result.txid)
 const txid = res1.data.result.txid

 supporterList=supporterList.map(x=>new Object({
  "destination":x,
  "amount":1,
  "payload_rpc":[{
          "name": "key",
          "datatype": "S",
          "value": key
  },
  {
    "name":"txid",
    "datatype":"S",
    "value":txid
  }
]
  }))
   
    
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