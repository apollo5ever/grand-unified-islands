import React from 'react'
import {LoginContext} from '../LoginProvider';

export default function SelectIsland(){
const {state, setState} = React.useContext(LoginContext);
  const setIsland= (e) => {
    e.preventDefault()
   

    setState({...state,active:parseInt(e.target.island.value)})


  }
  


  

    
      
    



    return(<>
        <div>
{state.myIslands && state.myIslands.length>1?<form onSubmit={setIsland}>
          <select id="island">{state.myIslands.map((x,i)=><option value={i}>{x.name}</option>)}</select>
          <button type="submit">Select</button>
           </form> :""}
            </div>
       
        </>
    )
}