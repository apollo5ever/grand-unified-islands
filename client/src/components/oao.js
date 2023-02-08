import React, {useContext} from 'react'
import { useParams ,Link} from 'react-router-dom'

import {LoginContext} from '../LoginProvider';
import to from 'await-to-js';
import DeroBridgeApi from '../api.js'
import sha256 from 'crypto-js/sha256'


export default function OAO() {
  const {state, setState} = useContext(LoginContext);
  const [openVoteMotion,setOpenVoteMotion] = React.useState(0)
  const [hash,setHash] = React.useState("")

  const [vacant, setVacant] = React.useState(null) 
  const [type, setType] = React.useState(null)
  const [AOS, setAOS] = React.useState(null)
  const [address, setAddress] = React.useState(null)
  const [status, setStatus] = React.useState(null)
  const [assetCheck, setAssetCheck] =React.useState(null)
  const [allowance, setAllowance] = React.useState(null)
  const [balance, setBalance] = React.useState(null)
  const [balanceAsset, setBalanceAsset] = React.useState(null)
  const [voteIndex,setVoteIndex] = React.useState(null)
  const [balanceList,setBalanceList] = React.useState([])
  const [allowanceList,setAllowanceList] = React.useState([])
  const [voteList,setVoteList] = React.useState([])
  const [ID,setID] = React.useState([])
  const [expires,setExpires] = React.useState(null)
  const oaoSCID = "875e8101b793ff71be181d7fa6b0337e6f24d85103c381bf92d36c23efc33acd"

  function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

  

  const hashCode = (event)=>{
    event.preventDefault();
    setHash(sha256(event.target.code.value).toString())
  }

  const getOAO = React.useCallback(async ()=>{
    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
      scid:oaoSCID,
      code:false,
      variables:true
    }))
    setVacant(res.data.result.stringkeys.vacantSeats)

    let idSearch = /\bmember_\d{1,2}\b/
   let id= Object.keys(res.data.result.stringkeys)
    .filter(key=>idSearch.test(key))
    .filter(key=>hex2a(res.data.result.stringkeys[key])==state.userAddress)
    .map(key=>key.substring(key.length-1,key.length))
    
    setID(id[0])

    var expiry = Math.round((res.data.result.stringkeys[`member_${id[0]}_expiry`]*1000 - parseInt(new Date().getTime()))/(1000*60*60*24))
  console.log(id[0],expiry)
    setExpires(expiry)

  let bl= Object.keys(res.data.result.balances)
.map(x=><p>Balance of {x=="0000000000000000000000000000000000000000000000000000000000000000"?"Dero":x}: {res.data.result.balances[x]} (atomic units)</p>)
setBalanceList(bl)

var search = new RegExp(`weeklyAllowance_.*`)
let allowances = Object.keys(res.data.result.stringkeys)
.filter(key=>search.test(key))
.map(key=><p>CEO's Weekly Allowance for {key.substring(16,key.length)}: {res.data.result.stringkeys[key]}(atomic units)</p>)

setAllowanceList(allowances)

  setVoteIndex(res.data.result.stringkeys.voteIndex)
  let i = res.data.result.stringkeys.voteIndex-1

  let type = "vote_" +i+"_type"
  let voteType=res.data.result.stringkeys[type]

  let status= "vote_"+i+"_status"
  let voteStatus=res.data.result.stringkeys[status]

  let amountOrSeat = "vote_"+i+"_amountOrSeat"
  let voteAOS = res.data.result.stringkeys[amountOrSeat]

  let address = "vote_"+i+"_address"
  let voteAddress = hex2a(res.data.result.stringkeys[address])


 
  setStatus(voteStatus)
  setType(voteType)
  setAOS(voteAOS)
  setAddress(voteAddress)
  var votes=[]
  for(var k=0;k<i+1;k++){
    votes.push(k)
  }

setVoteList(votes.map(x=><option value={x}>{x}</option>))


  })

  React.useEffect(()=>{
    getOAO()
  },[state])

  const checkVacancy = React.useCallback(async (event) => {
    event.preventDefault();
   const deroBridgeApi = state.deroBridgeApiRef.current
   const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
           scid:event.target.scid.value,
           code:false,
           variables:true
   }))

   let emptySeats=res.data.result.stringkeys.vacantSeats;
   console.log(err)
   console.log(res)
   console.log(emptySeats)
   
   setVacant(emptySeats)
   return(emptySeats)

   
 }) 


 const checkVote = React.useCallback(async (event) => {
   event.preventDefault();
  const deroBridgeApi = state.deroBridgeApiRef.current
  const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
          scid:oaoSCID,
          code:false,
          variables:true
  }))
  /* let test= `data`
  let voteStatus=res */
  let index = event.target.index.value

  let type = "vote_" +index+"_type"
  let voteType=res.data.result.stringkeys[type]

  let status= "vote_"+event.target.index.value+"_status"
  let voteStatus=res.data.result.stringkeys[status]

  let amountOrSeat = "vote_"+index+"_amountOrSeat"
  let voteAOS = res.data.result.stringkeys[amountOrSeat]

  let address = "vote_"+index+"_address"
  let voteAddress = hex2a(res.data.result.stringkeys[address])


  console.log(err)
  console.log(res)
  console.log(voteStatus)
  console.log(voteType)
  console.log(voteAOS)
  console.log(voteAddress)
  setStatus(voteStatus)
  setType(voteType)
  setAOS(voteAOS)
  setAddress(voteAddress)

  
}) 

const checkAllowance = React.useCallback(async (event) => {
 event.preventDefault();
const deroBridgeApi = state.deroBridgeApiRef.current
const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
        scid:event.target.scid.value,
        code:false,
        variables:true
}))
/* let test= `data`
let voteStatus=res */
let asset = event.target.asset.value

let allowance = "weeklyAllowance_" +asset
let assetAllowance=res.data.result.stringkeys[allowance]/100000

setAssetCheck(asset)
setAllowance(assetAllowance)


}) 


const checkBalance = React.useCallback(async (event) => {
 event.preventDefault();
 console.log("derobridgeee",state)
const deroBridgeApi = state.deroBridgeApiRef.current
const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
        scid:event.target.scid.value,
        code:false,
        variables:true
}))
/* let test= `data`
let voteStatus=res */
let asset = event.target.asset.value
let id =0
asset === "DERO" ? id = "0000000000000000000000000000000000000000000000000000000000000000" : id = asset


let assetBalance=res.data.result.balances[id]/100000


setBalance(assetBalance)
setBalanceAsset(asset)


})

  const updateOpenVoteMotion = (e)=>{
    setOpenVoteMotion(e.target.value)
  }

  const transferSeat = React.useCallback(async (event) => {
    event.preventDefault();
    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
    	"scid": oaoSCID,
    	"ringsize": 2,
    	"sc_rpc": [{
    		"name": "entrypoint",
    		"datatype": "S",
    		"value": "TransferSeat"
    	},
        {
    		"name": "id",
    		"datatype": "U",
    		"value": parseInt(ID)
    	},
      {
    		"name": "address",
    		"datatype": "S",
    		"value": event.target.address.value
    	}]
    }))

    console.log(err)
    console.log(res)
  })
  
    const openVote = React.useCallback(async (event) => {
      event.preventDefault();
      var aos =0
      if(!event.target.aos){ aos=0}
      else{ aos = event.target.aos.value}
      var stringArg =""
      if(!event.target.address){ stringArg=""}
      else{ stringArg = event.target.address.value}
      if(event.target.motion.value==4){
        aos = aos*100000
      }else if(event.target.motion.value==5){
        stringArg = sha256(stringArg).toString()
        console.log(stringArg)
      }
    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
    	"scid": oaoSCID,
    	"ringsize": 2,
    	"sc_rpc": [{
    		"name": "entrypoint",
    		"datatype": "S",
    		"value": "OpenVote"
    	},
        {
    		"name": "motion",
    		"datatype": "U",
    		"value": parseInt(event.target.motion.value)
    	},
        {
    		"name": "address",
    		"datatype": "S",
    		"value": stringArg
    	},
        {
    		"name": "amountOrSeat",
    		"datatype": "U",
    		"value": parseInt(aos)
    	}]
    }))

    console.log(err)
    console.log(res)
  })


  const castVote = React.useCallback(async (event) => {
    event.preventDefault();
    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
    	"scid": oaoSCID,
    	"ringsize": 2,
    	"sc_rpc": [{
    		"name": "entrypoint",
    		"datatype": "S",
    		"value": "CastVote"
    	},
        {
    		"name": "voteIndex",
    		"datatype": "U",
    		"value": parseInt(voteIndex-1)
    	},
        {
    		"name": "voterID",
    		"datatype": "U",
    		"value": parseInt(ID)
    	},
        {
    		"name": "opinion",
    		"datatype": "U",
    		"value": parseInt(event.target.opinion.value)
    	}]
    }))

    console.log(err)
    console.log(res)
  })


  const closeVote = React.useCallback(async () => {
    
    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
    	"scid": oaoSCID,
    	"ringsize": 2,
    	"sc_rpc": [{
    		"name": "entrypoint",
    		"datatype": "S",
    		"value": "CloseVote"
    	},
        {
    		"name": "voteIndex",
    		"datatype": "U",
    		"value": parseInt(voteIndex-1)
    	}]
    }))

    console.log(err)
    console.log(res)
  })






  
    
    return (
    <div>
    <div className="function">
         <div>

    
    <h1> Board Functions </h1>
    <p>Your Seat (#{ID}) {expires<0?<>is expired</>:<>expires in {expires} days</> };Seats Filled: {12-vacant}/12; Total Votes: {voteIndex};{balanceList}{allowanceList}</p>
   
    <div className="function">
      {status==0?<>
       <p> Motion to {type === 0 ? "hire "+ address +" as new CEO": type === 1 ? "fire CEO": type === 2 ? "add "+ address +" as board member "+ AOS : type === 3? "remove " +address +" from seat " +AOS : type === 4? "set weekly allowance of " +address +" to "+ AOS/100000 
  : "Update OAO Contract code. Hash of proposed code is: "+address}
{status === 0? ": Open" : status === 1 ? ": Passed" : status === 2? ": Rejected": ""}</p>
<h3> Cast Vote</h3>
    <form onSubmit={castVote}>
    
      <select id="opinion" name="opinion">
        <option value="0"> no </option>
        <option value="1"> yes</option>
      </select>
      <button type={"submit"}>Cast Vote</button>
    </form>
    <button onClick={()=>closeVote()}>Close Vote</button>
</>
   :<>
    <h3> Open a Vote </h3>
    <form onSubmit={openVote}>
   
    	<p>Motion </p>
      <select onChange={updateOpenVoteMotion} id="motion" name="motion">
        <option value="0">Hire CEO</option>
        <option value="1">Fire CEO</option>
        <option value="2">Add Board Member</option>
        <option value="3">Remove Board Member</option>
        <option value="4">Set CEO's Weekly Allowance</option>
        <option value="5">Approve OAO Code Update</option>
        </select>
        {openVoteMotion == 0 || openVoteMotion==1?
        <><p>CEO Address</p>
      <input id="address" type="text"/></>
      :openVoteMotion == 2 || openVoteMotion==3?
    <>
    <p>Board Member Address</p>
    <input id="address" type="text"/>
    <p>Board Seat ID</p>
    <input id="aos" type="text" />
    </>
    :openVoteMotion==4?
  <>
  <p>Asset SCID (or "DERO")</p>
  <input id="address" type ="text"/>
  <p>New Weekly Allowance</p>
  <input id="aos" type="text"/>
  </>
  :openVoteMotion==5?
  <>
  <p>New Code</p>
  <textarea placeholder="Enter New Code Here" rows="44" cols="80" id="address"></textarea>
  
  </>
  :""}
    	
    	<button type={"submit"}>Open Vote</button>
    </form>
    </> }
    </div>

    <div className="function">
    <h3> Vote History</h3>
  <p> Motion to {type === 0 ? "hire "+ address +" as new CEO": type === 1 ? "fire CEO": type === 2 ? "add "+ address +" as board member "+ AOS : type === 3? "remove " +address +" from seat " +AOS : type === 4? "set weekly allowance of " +address +" to "+ AOS/100000 
  : "Update OAO Contract code. Hash of proposed code is: "+address}
{status === 0? ": Open" : status === 1 ? ": Passed" : status === 2? ": Rejected": ""}</p>
  <form onSubmit={checkVote}>
    
    <p>Vote Index</p>
    <select id="index">{voteList}</select>
    <button type={"submit"}>Check Vote</button>
  </form>
  {type === 5?
  
  <form onSubmit={hashCode}>
    <p>Hash:{hash} </p>
    <textarea placeholder="Enter New Code Here" rows="44" cols="80" id="code"/>
    <button type={"submit"}>Check Hash</button>
  </form>
  :""
}
  </div>
  
<div className="function">
<h3> Transfer Seat</h3>
  <form onSubmit={transferSeat}>

    <p>Address</p>
    <input id="address" type="text" />

    <button type={"submit"}>Transfer Seat</button>
  </form>
  </div>


    






  </div>
        </div>
      


        </div>

    )
}