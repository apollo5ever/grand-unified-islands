import React, {useContext} from 'react'
import {LoginContext} from '../LoginProvider';
import FundCard from './fundCard'
import '../App.css'
import {useSearchParams,NavLink} from 'react-router-dom'
import to from 'await-to-js'
import sha256 from 'crypto-js/sha256'


export default function FundList(){

  const {state} = useContext(LoginContext);


   
    const [funds,setFunds] = React.useState([])
    let [searchParams, setSearchParams] = useSearchParams();

    function hex2a(hex) {
      var str = '';
      for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      return str;
  }
  
    const getFunds = React.useCallback(async () => {
     
     const deroBridgeApi = state.deroBridgeApiRef.current
     const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
             scid:state.scid,
             code:false,
             variables:true
     }))
  
     



     var search= new RegExp(`.*_sm`)
     console.log("search",search)
     var scData = res.data.result.stringkeys //.map(x=>x.match(search))

    let fundList= Object.keys(scData)
     .filter(key => search.test(key))
     .map(key=>[hex2a(scData[key]),scData[key.substring(0,66)+"Deadline"],scData[key.substring(0,66)+"Goal"],scData[key.substring(0,66)+"Raised"],scData[key.substring(0,66)+"Fundee"],scData[key.substring(0,66)+"Claimed"],key.substring(0,65)])
     
     console.log("hash array",fundList)
     
     for(let i = 0; i<fundList.length; i++){
    console.log("helllooo",state.ipfs)
    console.log("funds",funds)
    console.log("fundList",fundList)
      for await (const buf of state.ipfs.cat(fundList[i][0].toString())){
        let fund = JSON.parse(buf.toString())
        console.log(fund.island)
        console.log(sha256(fund.island).toString())
        console.log(fundList[i][6].substring(0,64))
       if(sha256(fund.island).toString()!=fundList[i][6].substring(0,64)) continue
       
        fund.index=fundList[i][6].substring(64,65)
        fund.deadline = fundList[i][1]
        fund.goal = fundList[i][2]/100000
        fund.raised = fundList[i][3]
        fund.fundee = fundList[i][4]
        fund.claimed = fundList[i][5]
        if(fund.deadline> new Date().getTime()/1000) fund.status=0
        else if(fund.deadline< new Date().getTime()/1000 && fund.goal< fund.raised) fund.status = 1
        else if(fund.deadline<new Date().getTime()/1000 && fund.goal > fund.raised) fund.status = 2
        setFunds(funds=>[...funds,fund])
        console.log("fundz",funds)
      }
     }
     //const meta = state.ipfs.get(subList[0].toString())
    // console.log("meta",meta)
/*
     const cid = subList[0].toString()
     console.log(cid)

for await (const buf of state.ipfs.cat(cid)) {
 
  console.log(JSON.parse(buf.toString()))
 console.log("fundarray",funds)
  
}
*/
     console.log(err)
     console.log(res)
    
  
     
   }) 

   React.useEffect(()=>{
    getFunds();
  },[state.ipfs])


     
     const fundJSX = funds.map(f => {
        if(searchParams.get("status") && f.status!=searchParams.get("status")) return
        if(searchParams.get("island") && f.island!=searchParams.get("island")) return
        
         return(<div className="function"><NavLink to={`/island/${f.island}/smokesignal/${f.index}`}><FundCard image={f.image} index={f.index} goal={f.goal} deadline={f.deadline} profile={f.island} name={f.name} tagline={f.tagline}/></NavLink></div>)
        
        })



    
     



      return(
         <div> 
            <div className="function">
                
            <h1>Smoke Signals</h1>
            <div className="status-selector">
            <ul>
                <li className="status-selector-option" onClick={()=>setSearchParams({"status":0})}>Active</li>
                <li onClick={()=>setSearchParams({"status":1})}>Successes</li>
                <li onClick={()=>setSearchParams({"status":2})}>Failures</li>
            </ul>
            </div>
            {fundJSX}
            
                
                </div>
         </div>
      )

}