
import DeroBridgeApi from '../api.js'
import React from 'react'
import ReactDOM from 'react-dom'
import to from 'await-to-js'
import sha256 from 'crypto-js/sha256'
import { useParams,useSearchParams } from 'react-router-dom'
import { LoginContext } from '../LoginContext';
import Success from './success.js'


export default function ModifyTier(){

const [searchParams,setSearchParams] = useSearchParams()
const params = useParams()
const [state, setState] = React.useContext(LoginContext);
const [tierObj,setTierObj] = React.useState({"name":null})
const [custom,setCustom]=React.useState(false)

function hex2a(hex) {
  var str = '';
  for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

const getTier = React.useCallback(async()=>{
  if(!state.myIslands) return
  let island = state.myIslands.filter(x=>x.name==params.island)
  const deroBridgeApi = state.deroBridgeApiRef.current
  const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
          scid:state.scid,
          code:false,
          variables:true
  }))
  island[0].tiers[params.tier].av=res.data.result.stringkeys[params.island+params.tier+"_Av"]
  island[0].tiers[params.tier].ad=hex2a(res.data.result.stringkeys[params.island+params.tier+"_Ad"])
  island[0].tiers[params.tier].am=res.data.result.stringkeys[params.island+params.tier+"_Am"]/100000
  setTierObj(island[0].tiers[params.tier])
})

React.useEffect(()=>{
  getTier()
},[state.myIslands])



const handleChange = e=> {
  if(e.target.value==="custom") setCustom(true)
  else{
    setCustom(false)
  }
  
}






    const DoIt = React.useCallback(async (event) => {
      event.preventDefault();

      var burn = 100

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
      var islandMeta=state.myIslands.filter(x=>x.name==params.island)[0]
      var interval=0
      console.log(event.target.wl.value)
        if(custom) interval = event.target.custom-interval.value
        else{
          interval = event.target.interval.value
        }
      islandMeta.tiers[params.tier]={
          name:event.target.tierName.value,
          perks:event.target.perks.value,
          index:params.tier
        }
        
      
      if(event.target.wl.checked){
        var whitelisted =1
      }else {
        var whitelisted =0
      }
       
      
        var subData = JSON.stringify({
          "pinataOptions": {
            "cidVersion": 0
          },
          "pinataMetadata": {
            "name": params.island,
            "keyvalues": {
            }
          },
          "pinataContent": islandMeta
        });
      
        const subPinata = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json','authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNjc5NzU5MS02OGUxLTQyNzAtYjZhMy01NjBjN2Y3M2IwYTMiLCJlbWFpbCI6ImJhY2tlbmRAYW1icm9zaWEubW9uZXkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDgzZTJkMGQ2Yzg2YTBhNjlkY2YiLCJzY29wZWRLZXlTZWNyZXQiOiJlN2VlMTE4MWM2YTBlN2FmNjQ0YmUzZmEyYmU1ZWY5ZWFmMmNmMmYyYzc0NWQzZGIxNDdiMThhOTU5NWMwZDNlIiwiaWF0IjoxNjYxMTk1NjUxfQ.9Pz2W_h7zCiYyuRuVySKcDwA2fl_Jbm6QDulihAIpmo`
         },
          
                body:  subData
        });
      
        
        const addSub= await state.ipfs.add(JSON.stringify(islandMeta).toString())
        const M =addSub.cid.toString()
      const deroBridgeApi=state.deroBridgeApiRef.current
        const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
          "scid": state.scid,
          "ringsize": 2,
          "transfers": transfers,
          "sc_rpc": [{
            "name": "entrypoint",
            "datatype": "S",
            "value": "AOMT"
          },
          {
            "name": "Am",
            "datatype": "U",
            "value":parseInt(event.target.amount.value*100000)
          },
          {
            "name": "I",
            "datatype": "U",
            "value":parseInt(interval)
          },
          {
            "name":"L",
            "datatype":"U",
            "value":parseInt(event.target.limit.value)
          },
          {
            "name":"Ad",
            "datatype": "S",
            "value": event.target.address.value
          },
          {
            "name": "H",
            "datatype": "S",
            "value": params.island
          },
          {
            "name":"i",
            "datatype":"U",
            "value":parseInt(params.tier)
          },
          {
            "name":"W",
            "datatype":"U",
            "value":whitelisted
          },
          {
            "name": "M",
            "datatype": "S",
            "value": M
          },
          {
            "name":"j",
            "datatype":"U",
            "value":islandMeta.j
          }
          ]
        }))
      
      setSearchParams({"status":"success"})
    })



    return(
      <div className="function">
      
     { searchParams.get("status")=="success"?<Success/>:<>
     <h1>{params.island}</h1>

      
        <h3>Message-In-A-Bottle Subscription</h3>
        <p>This is where you can post content for your subscribers. All parameters may be changed in future.</p>
        <p>This costs 100 coco. If you don't have enough you will be charged 0.1 Dero instead.</p>
        <form onSubmit={DoIt}>
        <input placeholder="Tier Name" id="tierName" defaultValue={tierObj.name} type="text"/>
        <input placeholder="Perks" id="perks" type="text" defaultValue={tierObj.perks}/>
        <input placeholder="address" id="address" type="text" defaultValue={tierObj.ad}/>
        <input placeholder="max number of subscribers" id="limit" defaultValue={tierObj.av} type="text"/>
        <p>Can anybody subscribe or will there be a whitelist?</p>
        <p>whitelisted<input id="wl" type="checkbox"/></p>
        <input placeholder="Amount(Dero)" id="amount" defaultValue={tierObj.am} type="text" />
        <select onChange={handleChange} id="interval">
      <option value="2629800">Monthly</option>
      <option value="7889400">Quarterly</option>
      <option value="31557600">Anual</option>
      <option value="custom">Custom</option>
    </select>
    {custom?<input placeholder = "Subscription Interval in Seconds" id="custom-interval" type="text" />:""}
    <button type={"submit"}>Submit</button>
    </form>
        
        </>}
      
          

</div> 
    )
}
