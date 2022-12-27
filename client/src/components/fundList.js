import React, {useContext} from 'react'
import {LoginContext} from '../LoginProvider';
import FundCard from './fundCard'
import '../App.css'
import {useSearchParams,NavLink} from 'react-router-dom'
import to from 'await-to-js'
import sha256 from 'crypto-js/sha256'
import getFundraisers from './getFundraisers'


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
     setFunds(await getFundraisers(state))
     
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
//     console.log(err)
  //   console.log(res)
    
  
     
   }) 

    React.useEffect(()=>{
  //  setFunds(await getFundraisers(state))
    
    getFunds();
  },[])


     
     const fundJSX = funds.map(f => {
        if(searchParams.get("status") && f.status!=searchParams.get("status")) return
        if(searchParams.get("island") && f.island!=searchParams.get("island")) return
        
         return(<div className="function"><NavLink to={`/island/${f.island}/smokesignal/${f.index}`}><FundCard image={f.image} index={f.index} goal={f.goal} deadline={f.deadline} profile={f.island} name={f.name} tagline={f.tagline}/></NavLink></div>)
        
        })



    
     



      return(
         <div> 
            <div>
                
            <h1>Smoke Signal Fundraisers</h1>
            <div className="status-selector">
            <ul>
                <li className="status-selector-option" onClick={()=>setSearchParams({"filter":"smokesignals","status":0})}>Active</li>
                <li onClick={()=>setSearchParams({"filter":"smokesignals","status":1})}>Successes</li>
                <li onClick={()=>setSearchParams({"filter":"smokesignals","status":2})}>Failures</li>
            </ul>
            </div>
            {fundJSX}
            
                
                </div>
         </div>
      )

}
