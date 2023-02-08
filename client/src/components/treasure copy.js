import React, {useContext} from 'react'
import { useParams,NavLink } from 'react-router-dom';
import {LoginContext} from '../LoginProvider';
import to from 'await-to-js'
import sha256 from 'crypto-js/sha256'
import AN from './AN';
import ATR from './ATR';
import RT from './RT';
import V from './V'
import Executer from './Executer';
import N from './N';
import Judge from './Judge';


export default function Treasure() {

  const {state, setState} = useContext(LoginContext);
  const [treasure,setTreasure] = React.useState({})
  const params = useParams()
  const island = params.island
  const index = params.index
  const [judging,setJudging]=React.useState([])
  const [executing,setExecuting] = React.useState(false)
  

  const getJudging = ()=>{
      console.log("myslands",state)
      if(!state.myIslands||!treasure.judgeList || state.myIslands.length==0)return
     
     var jl=[] 

  if(treasure.judgeList.includes(state.myIslands[state.active].name)) jl.push(state.myIslands[state.active])
  

  setJudging(jl)
  }

  const getExecuting = ()=>{
      console.log("executerlist",treasure.executerList,treasure.XN)
      if(!state.myIslands||!treasure.executerList || state.myIslands.length==0)return
      
      

  if(treasure.executerList.includes(state.myIslands[state.active].name)) setExecuting(true)
  else setExecuting(false)

  
  }

  React.useEffect(()=>{
      getJudging()
      getExecuting()
         
  },[state.myIslands,treasure,state.active])

 

  const AddTreasure =React.useCallback(async (event) =>{
    event.preventDefault();

    const deroBridgeApi = state.deroBridgeApiRef.current

    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
      "scid": state.scid,
      "ringsize": 2,
      "transfers": [
        {
          "destination":state.randomAddress,
          "burn":parseInt(event.target.amount.value*100000)

        }
      ],
      "sc_rpc": [{
        "name": "entrypoint",
        "datatype": "S",
        "value": "BT"
      },

      {
        "name": "H",
        "datatype": "S",
        "value": island
      },
      {
        "name": "i",
        "datatype": "U",
        "value": parseInt(index)
      },
      {
        "name": "J",
        "datatype": "S",
        "value": "J"
      },
      {
        "name":"X",
        "datatype":"S",
        "value":"X"
      },
      {
        "name": "E",
        "datatype": "U",
        "value": 0
      },
      {
        "name": "M",
        "datatype": "S",
        "value": "M"
      },
     
      {
        "name": "m",
        "datatype" : "S",
        "value": "m"
      },
      {
        "name":"j",
        "datatype":"U",
        "value":0
      }
      ]
    }))
  })

  function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

  const getFunds = React.useCallback(async () => {
     
    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
            scid:state.scid,
            variables:true
            
    }))
    


    var search= new RegExp(`${island+index}_bm`)
     console.log("search",search)
     var scData = res.data.result.stringkeys //.map(x=>x.match(search))

     let fundList= Object.keys(scData)
     .filter(key => search.test(key))
     .map(key=>[hex2a(scData[key]),scData[key.substring(0,key.length-2)+"E"],scData[key.substring(0,key.length-2)+"T"],scData[key.substring(0,key.length-2)+"J"],key.substring(0,key.length-3),Object.keys(scData).filter(key2=>new RegExp(`${island+key.substring(key.length-4,key.length-3)}*_J[0-9]`).test(key2)),scData[key.substring(0,key.length-2)+"JN"],scData[key.substring(0,key.length-2)+"JE"],scData[key.substring(0,key.length-2)+"JT"],Object.keys(scData).filter(key3=>new RegExp(`${island+key.substring(key.length-4,key.length-3)}*_X[0-9]`).test(key3)),scData[key.substring(0,key.length-2)+"XN"],scData[key.substring(0,key.length-2)+"XE"],scData[key.substring(0,key.length-2)+"XT"],scData[key.substring(0,key.length-2)+"X"],Object.keys(scData).filter(key4=>new RegExp(`${island+key.substring(key.length-4,key.length-3)}*_R_[0-9]`).test(key4)),Object.keys(scData).filter(key5=>new RegExp(`\\${island+key.substring(key.length-4,key.length-3)}\*_W_[0-9]`).test(key5)),scData[key.substring(0,key.length-2)+"JF"]])
     
     console.log("hash array",fundList)
     
     for(let i = 0; i<fundList.length; i++){
   
      for await (const buf of state.ipfs.cat(fundList[i][0].toString())){
        let fund = JSON.parse(buf.toString())

       if(fund.island!=fundList[i][4].substring(0,fundList[i][4].length-1)) continue
       
        fund.index=fundList[i][4].substring(fundList[i][4].length-1)
        fund.expiry = fundList[i][1]
        fund.treasure = fundList[i][2]/100000
        if(fundList[i][3]) {
          fund.judge = hex2a(fundList[i][3])
          fund.judgeAddress=hex2a(scData[`${fund.judge}_O`])
        }
        fund.judgeList=[]
        fund.JN= parseInt((fundList[i][6] + 1+(new Date().getTime()/1000 - fundList[i][7])/1209600)%fundList[i][8])
        if(new Date().getTime()/1000>fundList[i][7])
        {fund.JE = Math.round(1209600-(new Date().getTime()/1000-fundList[i][7])%1209600)
      }else fund.JE = Math.round(fundList[i][7]-new Date().getTime()/1000)
        for(var k=0;k<fundList[i][5].length;k++)
        {fund.judgeList.push(hex2a(scData[fundList[i][5][k]]))}

        if(fundList[i][13])fund.executer = hex2a(fundList[i][13])
        fund.executerList=[]
        fund.XN= parseInt((fundList[i][10] + 1+(new Date().getTime()/1000 - fundList[i][11])/1209600)%fundList[i][12])
        if(new Date().getTime()/1000>fundList[i][7])
        {fund.XE = Math.round(1209600-(new Date().getTime()/1000-fundList[i][11])%1209600)
      }else fund.XE = Math.round(fundList[i][11]-new Date().getTime()/1000)


        //fund.XE = Math.round(300-(new Date().getTime()/1000-fundList[i][11])%300)
        //fund.tXE = fundList[i][11]
        for(var k=0;k<fundList[i][9].length;k++)
        {fund.executerList.push(hex2a(scData[fundList[i][9][k]]))}
        fund.recipientList=[]
        for(var k=0;k<fundList[i][14].length;k++){
          fund.recipientList.push(hex2a(scData[fundList[i][14][k]]))
        }
        fund.weightList=[]
        fund.weightSum=0
        for(var k=0;k<fundList[i][15].length;k++){
          fund.weightSum += scData[fundList[i][15][k]]
          fund.weightList.push(scData[fundList[i][15][k]])
        }
        fund.weightList = fund.weightList.map(x=><>weight: {x} ({Math.round(100*x/fund.weightSum)}%)</>)
        fund.recipientList = fund.recipientList.map((x,i)=><li>{x} {fund.weightList[i]}</li>)
        fund.JF = fundList[i][16]
        if(fund.expiry> new Date().getTime()/1000 && fund.JF!=2) fund.status=0
        else if(fund.JF==2) fund.status=1
        else if(fund.expiry<new Date().getTime()/1000&&fund.JF!=2) fund.status=2
     
        setTreasure(fund)
        console.log(fund)
        
      }
     }

    console.log("res",res)
  }
  )





  const ClaimTreasure = React.useCallback(async (event) =>{
    event.preventDefault()
    console.log(treasure.judge)
    var hash = params.island
    const deroBridgeApi = state.deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {

       "ringsize": 16,
      "transfers":[
        {"destination":treasure.judgeAddress,
        "amount":1,
      
"payload_rpc":[
        {
                "name": "C",
                "datatype": "S",
                "value": "Treasure Claim Submitted by: " +state.userAddress
        },
        {
          "name":"POC",
          "datatype":"S",
          "value":event.target.proof.value
        }
]
        }
      ],
      
      
     
   
  }))

  })
   
  



    

      React.useEffect(() => {
        console.log("executed only once!");
        
        getFunds();
      }, [state.ipfs]);
    
    return (<div className="function">
        <div className="profile" >
          
         { treasure.name? <><img src={treasure.image}/>
            <h1>{treasure.name}</h1>
            <p>Initiated by <NavLink to={`/island/${island}`}>{island}</NavLink></p>
            <h3>Treasure: {treasure.treasure} Dero</h3>
            <h3>{treasure.tagline}</h3>
            {treasure.status==0?<p>This treasure expires on {new Date(treasure.expiry*1000).getDate()}/{new Date(treasure.expiry*1000).getMonth()+1}/{new Date(treasure.expiry*1000).getUTCFullYear()}. If treasure isn't released before this date, contributors can return to this page to receive a 95% refund.</p>
            :treasure.status==2?<p>This bounty has expired. If you added your treasure, you can reclaim it now.<RT island={island} index={index}/></p>
            :<p>This bounty was a success.</p>}
            
            
            {treasure.judge?<h3>Active Judge:<NavLink to={`/island/${treasure.judge}?view=main`}>{treasure.judge}</NavLink></h3>:""}
          {treasure.executer?<h3>Active Executer:<NavLink to={`/island/${treasure.executer}?view=main`}>{treasure.executer}</NavLink></h3>:""}

          {treasure.recipientList.length>0?
          <>These addresses have been nominated to receive the treasure:
          <ul>{treasure.recipientList}</ul></>
        :""}

        <div className="subscribe">
          <p>Nominated judges: <ol>{treasure.judgeList.map((j,i)=><li><NavLink to={`/island/${j}?view=main`}>{treasure.JN==i?<b>{j}{treasure.judgeList.length>1?<> (expires in {Math.round(treasure.JE/(60*60*24))} days)</>:""}</b>:j}</NavLink></li>)}</ol></p>
           
                        <p>Nominated executers: <ol>{treasure.executerList.map((j,i)=><li><NavLink to={`/island/${j}?view=main`}>{treasure.XN==i?<b>{j}{treasure.executerList.length>1?<> (expires in {Math.round(treasure.XE/(60*60*24))} days)</>:""}</b>:j}</NavLink></li>)}</ol></p>
          </div>
        
          {treasure.status==0 && state.myIslands.length>0 && island==state.myIslands[state.active].name?<div className='subscribe'><h3>Initiator Functions</h3><p>You initiated this bounty. You may nominate backup judges and executers.</p>
          <N island={island} index={index} dba={state.deroBridgeApiRef} l="X" scid={state.scid}/><N island={island} index={index} dba={state.deroBridgeApiRef} l="J" scid={state.scid}/>
          </div>:""}
         
         
         
{treasure.status==0 && state.myIslands && state.myIslands.length>0 && judging.length>0?
<Judge active={treasure.judgeList[treasure.JN]} userIsland={state.myIslands[state.active].name} island={island} index={index} judge={treasure.judge} JF={treasure.JF} deroBridgeApiRef={state.deroBridgeApiRef} scid={state.scid} XE={treasure.JE} solo={treasure.judgeList.length==1} recipientList={treasure.recipientList}/>
:""}


{treasure.status==0 && state.myIslands && state.myIslands.length>0 && executing?
            <Executer active={treasure.executerList[treasure.XN]} userIsland={state.myIslands[state.active].name} island={island} index={index} executer={treasure.executer} JF={treasure.JF} deroBridgeApiRef={state.deroBridgeApiRef} scid={state.scid} XE={treasure.XE} solo={treasure.executerList.length==1}/>:""}

            
            <p dangerouslySetInnerHTML={{__html: treasure.description}} />

            {treasure.status==0?<>
            <form onSubmit={AddTreasure}>
              <input placeholder="Amount (Dero)" id="amount"/>
              <button type={"submit"}>Add Treasure</button>
              
            </form>

            <form onSubmit={ClaimTreasure}>
              <button type={"submit"}>Claim Treasure</button>
              <input placeholder="proof" id="proof"/>
            </form>
            </>
            :""}
            
            </>:<p>Loading...</p>}
            

            
        </div></div>
    )
} 