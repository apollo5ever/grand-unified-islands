import React from 'react'
import { useParams } from 'react-router-dom';
import { LoginContext } from '../LoginContext';
import to from 'await-to-js'
import sha256 from 'crypto-js/sha256'
import getFundraisers from './getFundraisers';


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
    console.log(state,island)
     const fundraiser = await getFundraisers(state,island)
     console.log(await fundraiser)
     setSignal(await fundraiser[0])
  }
  )





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



     if(signal){ var deadline = new Date(signal.deadline*1000)
      var deadlinestring = (deadline.getMonth()+1).toString()+"/"+deadline.getDate().toString()+"/"+deadline.getUTCFullYear().toString()}

      React.useEffect(() => {
        console.log("executed only once!");
        //checkRaised();
        getFunds();
      }, [state.ipfs]);
    
    return (<div className="function">
        <div className="profile" >
          
     {  signal?<>   <img src={signal.image}/>
            <h1>{signal.name}</h1>
            <h3>{signal.tagline}</h3>
            <h3>Goal: {signal.goal} Dero by {deadlinestring}</h3>
            <h3>Funds will go to: {signal.fundee}</h3>
            <h3>Progress: {signal.raised}/{signal.goal}</h3>
           
<p dangerouslySetInnerHTML={{__html: signal.description}} />
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