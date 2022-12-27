import React from 'react'
import {LoginContext} from '../LoginProvider';
import {NavLink} from 'react-router-dom';
import AN from './AN'

export default function TreasureCard(props) {
  const {state} = React.useContext(LoginContext)
  const [judging, setJudging] = React.useState([])
  const [executing, setExecuting] = React.useState(false)

  const getJudging = () => {
    console.log("myslands", state)
    if (!state.myIslands || !props.judgeList) return

    for (var i = 0; i < state.myIslands.length; i++) {
      if (props.judgeList.includes(state.myIslands[i].name)) setJudging(judging => [...judging, state.myIslands[i]])
    }

  }

  const getExecuting = () => {
    console.log("myslands", state)
    if (!state.myIslands || !props.executerList) return


    if (props.executerList.includes(state.myIslands[state.active].name)) setExecuting(true)
    else setExecuting(false)


  }

  React.useEffect(() => {
    getJudging()
    getExecuting()
  }, [state.myIslands])

  return (<div className="card-card">
      <NavLink to={`/island/${props.profile}/treasure/${props.index}`}>
        <div className="ProfileCard">
          <h1>{props.name}</h1>
          <h3>Initiated by {props.profile}</h3>
          <img src={props.image} />
          <p>{props.tagline}</p>
          <p>Treasure:{props.treasure} Dero</p>
          <p>Judges: {props.judgeList ? props.judgeList.map(x => <>{x}, </>) : ""}</p>
          <b>Click to See More</b>
        </div>
      </NavLink>
      {judging.length > 0 ?

        <AN dba={state.deroBridgeApiRef} scid={state.scid} l="J" JX={judging[0].name} island={props.profile}
            index={props.index} />


        : ""}
      {executing ?

        <AN dba={state.deroBridgeApiRef} scid={state.scid} l="X" JX={state.myIslands[state.active].name}
            island={props.profile} index={props.index} />


        : ""}
    </div>
  )
}   