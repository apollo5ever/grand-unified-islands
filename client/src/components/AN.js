import React from 'react'
import to from 'await-to-js'





export default function AN(props){

  const accept=React.useCallback(async () => {
    const deroBridgeApi = props.dba.current


   
 
    
     const [err0, res0] = await to(deroBridgeApi.wallet('start-transfer', {
      
         "scid": props.scid,
         "ringsize": 2,
          "sc_rpc": [{
             "name": "entrypoint",
             "datatype": "S",
             "value": "AN"
         },
         {
             "name": "H",
             "datatype": "S",
             "value": props.island+props.index
         },
         {
             "name": "JX",
             "datatype": "S",
             "value": props.JX
         },
         {
          "name":"l",
          "datatype":"S",
          "value":props.l
         }
     ]
     }))

  }
  )


  

    
      
    



    return(<>
        <div>

          <button onClick={()=>accept()}>Accept {props.l=="J"?"Judge":"Executer"} Nomination</button>
            
            </div>
       
        </>
    )
}