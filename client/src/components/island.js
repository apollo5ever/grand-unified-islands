import React from 'react'
import { useParams } from 'react-router-dom'
import { LoginContext } from '../LoginContext';
import {useSearchParams,NavLink} from 'react-router-dom'
import to from 'await-to-js';
import TreasureCard from './treasureCard';
import FundCard from './fundCard';
import Subscribe from './subscribe';
import TrustIsland from './trustIsland';
import hex2a from './hex2a';
import getMIB from './getMIB';
import GI from './getIslands'




export default function Island(){
  
  
  const [post,setPost]=React.useState([])
  const [editing,setEditing]=React.useState("")
  const [tierToModify,setTierToModify]=React.useState(0)
  const [postTier,setPostTier] = React.useState(0)
  const [postToEdit,setPostToEdit]=React.useState(0)
  const [signalToClaim,setSignalToClaim]=React.useState(0)
  const [treasureToClaim,setTreasureToClaim]=React.useState(0)
  const [state, setState] = React.useContext(LoginContext);
  let [searchParams, setSearchParams] = useSearchParams();
  const [treasures,setTreasures] = React.useState([])
  const [judging,setJudging] = React.useState([])
  const [signals,setSignals] = React.useState([])
  const [bottles,setBottles] = React.useState([])
  const [trust,setTrust] = React.useState(0)
  const [view,setView] = React.useState("main")
  const params=useParams()
 

 /* function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}*/




  const getIslands = React.useCallback(async () => {
      setPost(await GI(state,params.island))

    
  //   const deroBridgeApi = state.deroBridgeApiRef.current
  //   const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
  //           scid:state.scid,
  //           code:false,
  //           variables:true
  //   }))
  //   var metaSearch= params.island+"_M"
  //   const meta = hex2a(res.data.result.stringkeys[metaSearch])
  //   for await (const buf of state.ipfs.cat(meta.toString())){
  //     try{
  //     let island = JSON.parse(buf.toString())
  
  //   setPost([island])
  // } catch(error){
  //   console.log(error)
  // }
  //  }
  
  
 
})

const getIslandObjects = React.useCallback(async () => {
  console.log(await getMIB(postFiltered[0],3,state))
  setTreasures([])
  setSignals([])
  setJudging([])
  setBottles([])
  const deroBridgeApi = state.deroBridgeApiRef.current
  const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
          scid:state.scid,
          code:false,
          variables:true
  }))

  var treasureSearch= new RegExp(`${params.island}[0-9]*_bm`)
  var signalSearch= new RegExp(`${params.island}[0-9]*_sm`)
  var judgeSearch = /.*_J\d{1,}/
  //var bottleSearch = new RegExp(`\\${params.island.toString()}\\d*_Av`)
  var bottleSearch = new RegExp(params.island+`\\d*_Av`)
  var trustSearch = new RegExp(`\\${params.island}\_T`)
  
  var scData = res.data.result.stringkeys //.map(x=>x.match(search))

 // console.log("BOTTLETESTRESZZ",newBottleSearch,Object.keys(scData).filter(key=>newBottleSearch.test(key)))

  let trustList = Object.keys(scData)
  .filter(key=>trustSearch.test(key))

  let trustScore = 0
  for (var t=0;t<trustList.length;t++){
    trustScore+= scData[trustList[t]]
  }
setTrust(trustScore/trustList.length)
  
  console.log("TRUST",trustList)
  console.log("PF",postFiltered[0])

  let tierList = Object.keys(scData)
  .filter(key=>bottleSearch.test(key))  
  .map(key=><Subscribe profile={params.island} name={postFiltered[0].tiers[key.substring(key.length-4,key.length-3)].name} index={key.substring(key.length-4,key.length-3)} perks={postFiltered[0].tiers[key.substring(key.length-4,key.length-3)].perks} amount={scData[key.substring(0,key.length-2)+"Am"]} interval={scData[key.substring(0,key.length-2)+"I"]} userAddress={state.userAddress} dba={state.deroBridgeApiRef} scid={state.scid} randomAddress={state.randomAddress}/>)

  console.log("tierList",tierList)
  console.log(bottleSearch)
  console.log(judgeSearch)

  setBottles(await getMIB(postFiltered[0],-1,state))

  let judgeList = Object.keys(scData)
  .filter(key=>judgeSearch.test(key))
  .map(key=>[hex2a(scData[key.substring(0,key.length-2)+"bm"]),hex2a(scData[key]),scData[key.substring(0,key.length-2)+"T"],scData[key.substring(0,key.length-2)+"E"],scData[key.substring(0,key.length-2)+"J"],key.substring(0,key.length-3),Object.keys(scData).filter(key2=>new RegExp(`${key.substring(0,key.length-1)}*[0-9]`).test(key2)),key])
console.log("judgeList",judgeList)
  for(let i=0;i<judgeList.length;i++){
    if(judgeList[i][1]!=postFiltered[0].name || judgeList[i][5].substring(0,judgeList[i][5].length-1)==postFiltered[0].name) continue
    console.log(judgeList[i][0])
    for await (const buf of state.ipfs.cat(judgeList[i][0].toString())){
      try{
      let treasure = JSON.parse(buf.toString())
   
      treasure.judgeList=[]
      for(var k=0;k<judgeList[i][6].length;k++)
      {treasure.judgeList.push(hex2a(scData[judgeList[i][6][k]]))}
     
      
     
      treasure.index=judgeList[i][5].substring(judgeList[i][5].length-1)
      treasure.expiry = judgeList[i][3]
      treasure.treasure = judgeList[i][2]/100000
      treasure.judge = judgeList[i][4]
     
      
      if(treasure.expiry> new Date().getTime()/1000) treasure.status=0
     
      setJudging(judging=>[...judging,treasure])
      console.log('treasuuuure',treasure)
    
  } catch(error){
    console.log('error',error)
  }
   }
  }

 let treasureList= Object.keys(scData)
  .filter(key => treasureSearch.test(key))
  .map(key=>[hex2a(scData[key]),scData[key.substring(0,key.length-2)+"E"],scData[key.substring(0,key.length-2)+"T"],scData[key.substring(0,key.length-2)+"J"],key.substring(0,key.length-3),Object.keys(scData).filter(key2=>new RegExp(`\\${postFiltered[0].name+key.substring(key.length-4,key.length-3)}\*_J[0-9]`).test(key2))])
     
  
  
  for(let i = 0; i<treasureList.length; i++){
console.log("help",treasureList[i][5])
 
   for await (const buf of state.ipfs.cat(treasureList[i][0].toString())){
     try{
     let treasure = JSON.parse(buf.toString())
  
     treasure.judgeList=[]
     for(var k=0;k<treasureList[i][5].length;k++)
     {treasure.judgeList.push(hex2a(scData[treasureList[i][5][k]]))}
     let j =0
     
    
     treasure.index=treasureList[i][4].substring(treasureList[i][4].length-1)
     treasure.expiry = treasureList[i][1]
     treasure.treasure = treasureList[i][2]/100000
     treasure.judge = treasureList[i][3]
    
     
     if(treasure.expiry> new Date().getTime()/1000) treasure.status=0
    
     setTreasures(treasures=>[...treasures,treasure])
     console.log("fundz",treasures)
   
 } catch(error){
   console.log(error)
 }
  }
  
}
let fundList= Object.keys(scData)
.filter(key => signalSearch.test(key))
.map(key=>[hex2a(scData[key]),scData[key.substring(0,key.length-2)+"D"],scData[key.substring(0,key.length-2)+"G"],scData[key.substring(0,key.length-2)+"R"],scData[key.substring(0,key.length-2)+"F"],scData[key.substring(0,key.length-2)+"C"],key.substring(0,key.length-3)])
     
console.log("hash array",fundList)

for(let i = 0; i<fundList.length; i++){
console.log("helllooo",state.ipfs)

console.log("fundList",fundList)
 for await (const buf of state.ipfs.cat(fundList[i][0].toString())){
   let fund = JSON.parse(buf.toString())
   console.log("fund.island",fund.island)
   
   console.log(fundList[i][6].substring(0,fundList[i][6].length-1))
  //if(fund.island!=fundList[i][6].substring(0,fundList[i][6].length-1)) continue
   fund.island= fundList[i][6].substring(0,fundList[i][6].length-1)
   fund.index=fundList[i][6].substring(fundList[i][6].length-1)
   fund.deadline = fundList[i][1]
   fund.goal = fundList[i][2]/100000
   fund.raised = fundList[i][3]
   fund.fundee = fundList[i][4]
   fund.claimed = fundList[i][5]
   if(fund.deadline> new Date().getTime()/1000) fund.status=0
   else if(fund.deadline< new Date().getTime()/1000 && fund.goal< fund.raised) fund.status = 1
   else if(fund.deadline<new Date().getTime()/1000 && fund.goal > fund.raised) fund.status = 2
   setSignals(signals=>[...signals,fund])
   
 }
}


})
/*
const getTXHistory = React.useCallback(async () => {
  const deroBridgeApi= state.deroBridgeApiRef.current
  const [err,res] = await to(deroBridgeApi.wallet('get'))
})
*/


React.useEffect(()=>{
  getIslandObjects()
},[post,searchParams])

   
    React.useEffect(() => {
      setPost([])
       getIslands()
        
      },[state.myIslands])

     

    

      const postFiltered = post.filter((i,x) => {
        if(searchParams.get("index") && x!=searchParams.get("index")) return
     return(i)
        
        })
        console.log(postFiltered)
        

        const changeTierToModify = e=>{
          e.preventDefault()
          setTierToModify(e.target.value)
        }
        const changePostTier = e=>{
          e.preventDefault()
          setPostTier(e.target.value)
        }
        const changePostToEdit = e=>{
          e.preventDefault()
          setPostToEdit(e.target.value)
        }

        const changeSignalToClaim= e=>{
          e.preventDefault()
          setSignalToClaim(e.target.value)
        }
        const changeTreasureToClaim= e=>{
          e.preventDefault()
          setTreasureToClaim(e.target.value)
        }


    return(
        <div className="function">
          <div className="profile">

          
          
         
          <>{postFiltered.length===0? 
          <p>Loading...</p>
          : postFiltered.length===1?

          <div>
            <div className="icons">
          
            <img src={postFiltered[0].image}/>
           
            <h1 onClick={()=>setSearchParams({"view":"main"})}>{postFiltered[0].name}</h1></div>
           
         
          {searchParams.get("view")=="main"?<>
          

          <p>{postFiltered[0].tagline}</p>
          <p>Social Coconut Score:{trust?trust:"Not trusted by any island operators"}</p>
          
         
          
          
          <p dangerouslySetInnerHTML={{__html: postFiltered[0].bio}} />
          
          
          </>
          :searchParams.get("view")=="treasure"?
          <>{treasures.length>0?<>
            {treasures.map(x=><TreasureCard className="mytreasure" name={x.name} profile={x.island} tagline={x.tagline} treasure={x.treasure} image={x.image} judgeList={x.judgeList} index={x.index}/>)}
</>:<p>No Buried Treasures yet</p>}
{judging.length>0?<>
            {judging.map(x=><TreasureCard className="mytreasure" name={x.name} profile={x.island} tagline={x.tagline} treasure={x.treasure} image={x.image} judgeList={x.judgeList} index={x.index}/>)}
</>:<p>No Judging any treasure</p>}

            </>
          :searchParams.get("view")=="signal"?<>
          {signals.length>0?<>
            {signals.map(x=><NavLink to={`/island/${x.island}/smokesignal/${x.index}`}><FundCard name={x.name} profile={x.island} tagline={x.tagline} goal={x.goal} image={x.image} deadline={x.deadline}/></NavLink>)}
</>:<><p>No Smoke Signals Yet</p>
</>}
</>
          :searchParams.get("view")=="mail"?<>
          
          {bottles}</>
          :""}

          <div className="icons">
               <div className="icons-treasure" onClick={()=>setSearchParams({"view":"treasure"})}><div className="icons-text">Bounties</div></div><div className="icons-signal" onClick={()=>setSearchParams({"view":"signal"})}><div className="icons-text">Fundraisers</div></div><div className="icons-mail" onClick={()=>setSearchParams({"view":"mail"})}><div className="icons-text">Subscriptions</div></div>
          
          </div>
         
          {/*
          <h3>Add or Modify Subscription Tiers</h3>
          
          <form>
          <select id="tier" onChange={changeTierToModify} >{postFiltered[0].tiers.map(x=><option value={x.index}>{x.name}</option>)}<option value={postFiltered[0].tiers.length}>New Tier</option></select>
          <NavLink to={`/modifytier/${postFiltered[0].name}/${tierToModify}`}><button>Add or Modify</button></NavLink>
          </form>
          <NavLink to={`/newsignal/${postFiltered[0].name}`}><h3>Add Smoke Signal Fundraiser</h3></NavLink>
          <NavLink to={`/burytreasure/${postFiltered[0].name}`}><h3>Bury Treasure</h3></NavLink>
          <NavLink to={`/newPost/${postFiltered[0].name}`}><h3>Publish new Post</h3></NavLink>
          {postFiltered[0].tiers.length === 0? "":<>
          <h3>View and Edit Old Posts</h3>
          <form>
          <select id="tier" onChange={changePostTier} >{postFiltered[0].tiers.map(x=><option value={x.index}>{x.name}</option>)}</select>
          <select id="post" onChange={changePostToEdit} >{postFiltered[0].tiers[postTier].posts.map((x,i)=><option value={i}>{x.title}</option>)}</select>
          <NavLink to={`/island/${postFiltered[0].name}/${postTier}/${postToEdit}/edit`}><button>View and Edit Post</button></NavLink>
          
          </form>
        
          </> }
          <h3>Your Fundraisers</h3>
          <form>
            
          <select id="signal" onChange={changeSignalToClaim} >{postFiltered[0].fundraisers.map(x=><option value={x.index}>{x.name}</option>)}</select>
          <NavLink to={`/island/${postFiltered[0].name}/smokesignal/${signalToClaim}`}><button>View</button></NavLink>
          </form>


          <h3>Your Buried Treasures</h3>
          <form>
            
          <select id="signal" onChange={changeTreasureToClaim} >{postFiltered[0].treasures.map(x=><option value={x.index}>{x.name}</option>)}</select>
          <NavLink to={`/island/${postFiltered[0].name}/treasure/${treasureToClaim}`}><button>View</button></NavLink>
          </form>

          


          */}
          
          </div>
          
          
          
          
          
          
          
          
          :
          <div><h1>Choose your Island</h1>
          {postFiltered.map((x,i)=><h2 onClick={()=>setSearchParams({"index":i})}>{x.name}</h2>)}
          </div>
          }</>
          
            
          </div>
          {state.myIslands&&state.myIslands.length>0?<TrustIsland island={params.island}/>:""}
        </div>
    )
}