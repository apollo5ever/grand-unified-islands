import React from 'react'
import TreasureCard from './treasureCard'
import '../App.css'
import {useSearchParams,NavLink} from 'react-router-dom'

import to from 'await-to-js'
import sha256 from 'crypto-js/sha256'
import getIslands from './getIslands'
import getMIB from './getMIB'



export default  function BottleList(props){


   
    const [tiers,setTiers] = React.useState([])

    const getTiers = async()=>{
      var tierList=[]

    let islands = await getIslands(props.state)
    for(var i=0;i<islands.length;i++){
      tierList=tierList.concat(await getMIB(islands[i],-1,props.state))
    }
    console.log("BOTTLELIST",tierList)
setTiers(tierList)
    }

    React.useEffect(()=>{
      getTiers()

    },[])
    


      return(
         <><h1>Island Subscriptions</h1>{tiers.map(x=><div className="function">{x}</div>)}</>
      )

}