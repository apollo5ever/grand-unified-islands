import React from 'react'
import { useParams } from 'react-router-dom';
import { LoginContext } from '../LoginContext';
import to from 'await-to-js'
import sha256 from 'crypto-js/sha256'


export default function Fundraiser() {

  const [signal,setSignal] = React.useState({})
  const params = useParams()
  const island = params.island
  const index = params.index
  const [state, setState] = React.useContext(LoginContext);

  const [raised,setRaised] = React.useState(-1)

  function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

  const getFunds = React.useCallback(async () => {
     
    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
            scid:state.scid,
            variables:true,
            keysstring:[island+index+"_sm",island+index+"_G"]
    }))
    
   // res.data.result.stringkeys[sha256(island).toString()+index+"_M"]

    var search= new RegExp(`${island+index}_sm`)
     console.log("search",search)
     var scData = res.data.result.stringkeys //.map(x=>x.match(search))

    let fundList= Object.keys(scData)
     .filter(key => search.test(key))
     .map(key=>[hex2a(scData[key]),scData[key.substring(0,key.length-2)+"D"],scData[key.substring(0,key.length-2)+"G"],scData[key.substring(0,key.length-2)+"R"],hex2a(scData[key.substring(0,key.length-2)+"F"]),scData[key.substring(0,key.length-2)+"C"],key.substring(0,key.length-3)])
     
     console.log("hash array",fundList)
     
     for(let i = 0; i<fundList.length; i++){
    console.log("helllooo",state.ipfs)
    console.log(await state.ipfs.id())
   
    console.log("fundList",fundList)
      for await (const buf of state.ipfs.cat(fundList[i][0].toString())){
        let fund = JSON.parse(buf.toString())
        console.log(fund.island)
        console.log(sha256(fund.island).toString())
        console.log(fundList[i][6].substring(0,64))
       
       
        fund.index=fundList[i][6].substring(fundList[i][6]-1)
        fund.deadline = fundList[i][1]
        fund.goal = fundList[i][2]/100000
        fund.raised = fundList[i][3]
        fund.fundee = fundList[i][4]
        fund.claimed = fundList[i][5]
        if(fund.deadline> new Date().getTime()/1000) fund.status=0
        else if(fund.deadline< new Date().getTime()/1000 && fund.goal< fund.raised) fund.status = 1
        else if(fund.deadline<new Date().getTime()/1000 && fund.goal > fund.raised) fund.status = 2
        setSignal(fund)
        setRaised(fund.raised/100000)
      }
     }

    console.log("res",res)
  }
  )



  const checkRaised = React.useCallback(async () => {
      
      const deroBridgeApi = state.deroBridgeApiRef.current
      const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
          scid: state.scid,
          code: false,
          variables: true
      }))
      const obj = res.data.result.stringkeys
     let search = sha256(params.island) +params.index+"_Raised"
     let r = obj[search]
     console.log("avail",r)
      setRaised(r/100000)
      return(r)
      

      
      

  })

  const withdraw = React.useCallback(async (event) =>{
    event.preventDefault()
    var hash = params.island
    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
      "scid": state.scid,
      "ringsize": 2,
      "sc_rpc": [{
          "name": "entrypoint",
          "datatype": "S",
          "value": "WFF"
      },
      {
          "name": "H",
          "datatype": "S",
          "value": hash
      },
      {
        "name":"i",
        "datatype": "U",
        "value" : parseInt(params.index)
      }
  ]
  }))

  })
   
  
  const supportGoal = React.useCallback(async (event) => {
    event.preventDefault()
    var HashAndIndex = params.island+params.index
    if(event.target.refundable.checked){
      var refundable =1
    }else {
      var refundable =0
    }
console.log(HashAndIndex,refundable,state.scid,state.randomAddress)
   


    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
      "scid": state.scid,
      "ringsize": 2,
      "transfers": [{
         "burn": (parseInt((event.target.amount.value)*100000)),
         "destination":state.randomAddress
       }],
      "sc_rpc": [{
          "name": "entrypoint",
          "datatype": "S",
          "value": "SG"
      },
      {
          "name": "H",
          "datatype": "S",
          "value": HashAndIndex
      },
      {
        "name":"R",
        "datatype": "U",
        "value" : refundable
      }
  ]
  }))
  })



      var deadline = new Date(signal.deadline*1000)
      var deadlinestring = (deadline.getMonth()+1).toString()+"/"+deadline.getDate().toString()+"/"+deadline.getUTCFullYear().toString()

      React.useEffect(() => {
        console.log("executed only once!");
        //checkRaised();
        getFunds();
      }, [state.ipfs]);
    
    return (<div className="function">
        <div className="profile" >
          
     {  signal.image?<>   <img src={signal.image}/>
            <h1>{signal.name}</h1>
            <h3>{signal.tagline}</h3>
            <h3>Goal: {signal.goal} Dero by {deadlinestring}</h3>
            <h3>Funds will go to: {signal.fundee}</h3>
            <h3>Progress: {raised!=-1? raised:
             <b className="availabilityCheck" onClick={()=>checkRaised()}> check</b>}/{signal.goal}</h3>
            <h3>{signal.description}</h3>
            {signal.status==0?<><form onSubmit={supportGoal}>
            <input id="amount" placeholder="Dero amount to donate" type="text"/>
            <label htmlFor='refundable'>Refundable?</label>
            <input id="refundable" type="checkbox"/>
            <button type={"submit"}>Support</button>
          </form>
          {raised>=signal.goal?
          <form onSubmit={withdraw}>
          <button type={"submit"}>Withdraw</button>
        </form>:""}
          </>
          :signal.status==1?<>
          <p>This Smoke Signal has met its fundraiser goal! If you are the owner, you can withdraw the funds to the fundee now.</p>
          <form onSubmit={withdraw}>
          <button type={"submit"}>Withdraw</button>
        </form></>
          :signal.status==2?
        <><p>This Smoke Signal failed to meet its goal. If you made a refundable donation, you can withdraw those funds now.</p>
        <form onSubmit={withdraw}>
          <button type={"submit"}>Withdraw</button>
        </form>
        </>:""}
</>:<p>Loading...</p>}
            
        </div></div>
    )
}