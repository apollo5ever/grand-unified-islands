import DeroBridgeApi from '../api.js'
import React from 'react'
import ReactDOM from 'react-dom'
import to from 'await-to-js'
import { LoginContext } from '../LoginContext';



export default function GetCocos(){

  const [state, setState] = React.useContext(LoginContext);


    const DoIt = React.useCallback(async (event) => {
      event.preventDefault();
      
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
                "value": "BuyCoco"
            }]
        }))
    
        console.log(err)
        console.log(res)

    })

   
    return(
      <div className="cocos">
      
      
     

           <div>
  <form onSubmit={DoIt}>

  
    <input placeholder="Dero amount" id="amount" type="text"/>
  <p>1 Dero = 10 Coco</p>
    <button type={"submit"}>Buy Coco</button>
  </form>
        </div></div> 
    )
}
