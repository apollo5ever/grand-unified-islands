import React from 'react'
import to from 'await-to-js'
import hex2a from './hex2a'




export default function N(props){

    const [judges,setJudges] = React.useState([])
    const [execs,setExecs] = React.useState([])


    const getJudges = React.useCallback(async () =>{
        const deroBridgeApi = props.dba.current
          const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
                  scid:props.scid,
                  code:false,
                  variables:true
          }))
    
          var search= new RegExp(`.*_j`)  
         
          var scData = res.data.result.stringkeys //.map(x=>x.match(search))
        
        
        const judgeList=Object.keys(scData)
          .filter(key => search.test(key))
          .filter(key=>scData[key]==1||scData[key]==3)
          .map(key=><option value={key.substring(0,key.length-2)}>{key.substring(0,key.length-2)}</option>)
          
        setJudges(judgeList)
          
        const execList=Object.keys(scData)
        .filter(key => search.test(key))
        .filter(key=>scData[key]==2||scData[key]==3)
        .map(key=><option value={key.substring(0,key.length-2)}>{key.substring(0,key.length-2)}</option>)
        
      setExecs(execList)
    
      })

  const nominate=React.useCallback(async (e) => {
    e.preventDefault()
    const deroBridgeApi = props.dba.current


     const [err0, res0] = await to(deroBridgeApi.wallet('start-transfer', {
      
         "scid": props.scid,
         "ringsize": 2,
          "sc_rpc": [{
             "name": "entrypoint",
             "datatype": "S",
             "value": "N"
         },
         {
             "name": "H",
             "datatype": "S",
             "value": props.island
         },
         {
            "name": "i",
            "datatype": "U",
            "value":parseInt(props.index)
         },
         {
             "name": "JX",
             "datatype": "S",
             "value": e.target.JX.value
         },
         {
          "name":"l",
          "datatype":"S",
          "value":props.l
         }
     ]
     }))

     const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
        scid:props.scid,
        code:false,
        variables:true
}))

     const Address=hex2a(res.data.result.stringkeys[`${e.target.JX.value}_O`])
     const [err3,res3] =await to(deroBridgeApi.wallet('start-transfer',{
       "ringsize":2,
       "transfers":[
       {"destination":Address,
       "amount":1,
           
       "payload_rpc":[
               {
                       "name": "C",
                       "datatype": "S",
                       "value": "You have been nominated for bounty executer by: " +props.island
               }]
               }]
     }))

  }
  )

  React.useEffect(()=>{
    getJudges()
  },[])


 
    return(<>
        <div>
            <form onSubmit={nominate}>
                {props.l=="X"?
                <select id="JX">{execs}</select>:
                props.l=="J"?
            <select id="JX">{judges}</select>
        :""}
        <button type="submit">Nominate{props.l=="J"?" Judge":" Executer"}</button>
            </form>

          
            
            </div>
       
        </>
    )
}