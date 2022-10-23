import React from 'react'
import ATR from './ATR'
import AN from './AN'


export default function Judge(props) {
    const [expiry,setExpiry] = React.useState(0)

    const getExpiry = ()=>{
        if(props.JE > new Date().getTime()/1000) setExpiry(props.JE)
        else{
            setExpiry(Math.round(1209600-(new Date().getTime()/1000-props.JE)%1209600))
        }
    }

    React.useEffect(()=>
    getExpiry()
    ,[])


    return(
        <div className= "subscribe">
<h3>Judge Functions</h3>
<p>You have been nominated as judge for this bounty.</p>

   


              {props.solo?
	<> {props.judge!=props.userIsland?
		<><AN dba={props.deroBridgeApiRef} scid={props.scid} l="J" JX={props.userIsland} island={props.island} index={props.index}/></>
	:<>
	{props.JF==1 ||props.JF==2?
		<><p>Nothing to do.</p> </>
	:<><ATR dba={props.deroBridgeApiRef} scid={props.scid} island={props.island} index={props.index} recipientList={props.recipientList}/></>
	}
    </>
		
	}</>
:
	<>{props.active==props.userIsland?
		<>
		{props.JF==1 || props.JF==2?
			<><p>Nothing to do</p></>
		:<><AN dba={props.deroBridgeApiRef} scid={props.scid} l="J" JX={props.userIsland} island={props.island} index={props.index}/><ATR dba={props.deroBridgeApiRef} scid={props.scid} island={props.island} index={props.index} recipientList={props.recipientList}/></>}
		</>
	:	<><p>Nothing to do</p></>}
	</>}

            
            </div>
    )
}