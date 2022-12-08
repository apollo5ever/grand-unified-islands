import React from 'react'
import { NavLink } from 'react-router-dom';
import IslandCard from './islandCard';
import { LoginContext } from '../LoginContext';
import to from 'await-to-js';
import { useSearchParams } from 'react-router-dom';
import BountyList from './bountyList';
import FundList from './fundList';
import {default as GI} from './getIslands'
import BottleList from './bottleList';


export default function IslandList(){

    const [islands,setIslands] = React.useState([])
    const [state, setState] = React.useContext(LoginContext);
    const [view,setView]=React.useState("");
    let [searchParams, setSearchParams] = useSearchParams();

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array
  }


    function hex2a(hex) {
      var str = '';
      for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      return str;
  }

    const getIslands = React.useCallback(async () => {
     
      setIslands(await GI(state))
    })




    React.useEffect(() => {
            getIslands()
      }, [state.ipfs])



     
     const islandJSX = shuffleArray(islands).map(bio => {
         return( <NavLink to={`/island/${bio.name}?view=main`}><IslandCard  name={bio.name} tagline={bio.tagline} image={bio.image} /></NavLink> )
     })
      return(
        <div className="function">
          <NavLink to={`/archipelago`}><h1>The Archipelago</h1></NavLink>
           <div className="icons">
               <div className="icons-treasure" onClick={()=>{setSearchParams({filter:"treasure"})}}><div className="icons-text">Bounties</div></div><div className="icons-signal" onClick={()=>{setSearchParams({filter:"smokesignals"})}}><div className="icons-text">Fundraisers</div></div><div className="icons-mail" onClick={()=>{setSearchParams({filter:"mib"})}}><div className="icons-text">Subscriptions</div></div>
          </div>
         {!searchParams.get("filter")?<div>
          
          <div className="profile-card-grid">{islandJSX}</div>
                
         
         </div>
         :searchParams.get("filter")=="treasure"? <BountyList/>
         :searchParams.get("filter")=="smokesignals"?<FundList/>
         :searchParams.get("filter")=="mib"?<BottleList state={state}/>
         :""}
         </div>
      )

}