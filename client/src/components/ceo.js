import React from 'react'
import { useParams ,Link} from 'react-router-dom'

import { LoginContext } from '../LoginContext';
import to from 'await-to-js';
import DeroBridgeApi from '../api.js'
import sha256 from 'crypto-js/sha256'


export default function CEO() {
  const [state, setState] = React.useContext(LoginContext);
  const [openVoteMotion,setOpenVoteMotion] = React.useState(0)

  const [vacant, setVacant] = React.useState(null) 
  const [type, setType] = React.useState(null)
  const [AOS, setAOS] = React.useState(null)
  const [address, setAddress] = React.useState(null)
  const [status, setStatus] = React.useState(null)
  const [assetCheck, setAssetCheck] =React.useState(null)
  const [allowance, setAllowance] = React.useState(null)
  const [balance, setBalance] = React.useState(null)
  const [balanceAsset, setBalanceAsset] = React.useState(null)

  function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

  const consoleState=()=>{
    console.log(state)
  }




 const checkVote = React.useCallback(async (event) => {
   event.preventDefault();
  const deroBridgeApi = state.deroBridgeApiRef.current
  const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
          scid:event.target.scid.value,
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
    	"scid": event.target.scid.value,
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

  const withdraw = React.useCallback(async (event) => {
    event.preventDefault();
    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
    	"scid": event.target.scid.value,
    	"ringsize": 2,
    	"sc_rpc": [{
    		"name": "entrypoint",
    		"datatype": "S",
    		"value": "Withdraw"
    	},
        {
    		"name": "asset",
    		"datatype": "S",
    		"value": event.target.asset.value
    	},
      {
    		"name": "amount",
    		"datatype": "U",
    		"value": parseInt(event.target.amount.value)
    	}]
    }))

    console.log(err)
    console.log(res)
  })

  
  const updateOAO = React.useCallback(async (event) => {
    event.preventDefault();
    var code = event.target.code.value
    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
    	"scid": event.target.scid.value,
    	"ringsize": 2,
      "fees":100000,
    	"sc_rpc": [{
    		"name": "entrypoint",
    		"datatype": "S",
    		"value": "Update"
    	},
        {
    		"name": "code",
    		"datatype": "S",
    		"value": code
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
    <div className="function">
    <h3> Open Vote </h3>
    <form onSubmit={openVote}>
      <p>Your OAO Contract's SCID </p>
      <input id="scid" type="text" />
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
  <p>Sha256 of New Code</p>
  <textarea placeholder="Enter New Code Here" rows="44" cols="80" id="address"></textarea>
  
  </>
  :""}
    	
    	<button type={"submit"}>Open Vote</button>
    </form>
    </div>





 


  

  <div className="function">
    <h3>Check Contract Balance</h3>
    <h4>Balance is {balance} {balanceAsset}</h4>
    <form onSubmit={checkBalance}>
      <p>Your OAO Contract's SCID</p>
      <input id="scid" type="text"/>
      <p>Asset</p>
      <input id="asset" type="text"/>
      <button type={"submit"}>Check Balance</button>
    </form>
    </div>

 

    <div className="function">
    <h3> Check Vote</h3>
  <p> Motion to {type === 0 ? "hire "+ address +" as new CEO": type === 1 ? "fire CEO": type === 2 ? "add "+ address +" as board member "+ AOS : type === 3? "remove " +address +" from seat " +AOS : "set weekly allowance of " +address +" to "+ AOS/100000}
{status === 0? ": Open" : status === 1 ? ": Passed" : status === 2? ": Rejected": ""}</p>
  <form onSubmit={checkVote}>
    <p>Your OAO Contract's SCID</p>
    <input id="scid" type="text" />
    <p>Vote Index</p>
    <input id="index" type="text" />
    <button type={"submit"}>Check Vote</button>
  </form>
  </div>

  <div className="function">
  <h3> Check Weekly Allowance</h3>
  <p>Allowance for {assetCheck} is {allowance}</p>
  <form onSubmit={checkAllowance}>
    <p>Your OAO Contract's SCID</p>
    <input id="scid" type="text" />
    <p>Asset</p>
    <input id="asset" type="text" />
    <button type={"submit"}>Check Allowance</button>
  </form>
  </div>

  </div>

  <div className="function">
    <h3> Withdraw Funds </h3> 
    <form onSubmit={withdraw}>
      <p>Your OAO Contract's SCID</p>
      <input id="scid" type="text" />
      <p>Asset</p>
      <input id="asset" type="text" />
      <p>Amount</p>
      <input id="amount" type="text" />
      <button type={"submit"}>Withdraw</button>
    </form>
  </div>

  <div className="function">
    <h3> Update OAO Code </h3> 
    <form onSubmit={updateOAO}>
      <p>Your OAO Contract's SCID</p>
      <input id="scid" type="text" />
      <p>New Code</p>
      <textarea placeholder="Enter New Code Here" rows="44" cols="80" id="code"/>
      <button type={"submit"}>Update</button>
    </form>
  </div>
        </div>
      


        </div>

    )
}