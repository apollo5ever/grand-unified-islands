import React from 'react'
import to from 'await-to-js'





export default function ATR(props){

  const addRecipient=React.useCallback(async (e) => {
    e.preventDefault()
    const deroBridgeApi = props.dba.current

var f = 0
if(e.target.final.checked) f=1
   
    
    
     const [err0, res0] = await to(deroBridgeApi.wallet('start-transfer', {
        

      
         "scid": props.scid,
         "ringsize": 2,
          "sc_rpc": [{
             "name": "entrypoint",
             "datatype": "S",
             "value": "ATR"
         },
         {
             "name": "H",
             "datatype": "S",
             "value": props.island+props.index
         },
         {
             "name": "R",
             "datatype": "S",
             "value": e.target.recipient.value
         },
         {
          "name":"I",
          "datatype":"U",
          "value":parseInt(e.target.index.value)
         },
         {
            "name":"W",
            "datatype":"U",
            "value":parseInt(e.target.weight.value)
         },
         {
            "name":"F",
            "datatype":"U",
            "value":f
         }
     ]
     }))

  }
  )


  

    
      
    



    return(<>
        <div>
        <form onSubmit={addRecipient}>
            <select id="index">{props.recipientList.map((x,i)=><option value={i}>Modify {x}</option>)}<option value={props.recipientList.length}>Add New</option></select>
            <input id="recipient" placeholder='recipient dero address' type="text"/>
            <input id="weight" placeholder="weight" type="text"/>
            <p>Check Box if this is final recipient and treasure is ready to be released.</p>
            <input id="final" type="checkbox"/>
          <button type="submit">Add Recipient</button>
            </form>
            </div>
       
        </>
    )
}