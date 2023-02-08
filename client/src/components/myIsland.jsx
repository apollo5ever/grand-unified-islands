import React, {useContext, useEffect} from 'react'
import {NavLink, useSearchParams} from 'react-router-dom'
import {LoginContext} from '../LoginProvider';
import {ContractContext} from './providers/contractProvider';
import to from 'await-to-js';
import {ContractUtils} from '../utils/contractHelper';
import TreasureCard from './treasureCard';
import FundCard from './fundCard';
import Feed from './feed';
import FutureFeed from './futureFeed';
import {useGetContractData} from '../hooks/useGetContractData';


// TODO - MTS - Status
//  Lots of code to clean up, but did introduce hook to get contract
//  I need to get a better grasp of more of the code b4 I start rewriting this
export default function MyIsland() {
  const {state} = useContext(LoginContext)
  const [island, setIsland] = React.useState([])
  const [editing, setEditing] = React.useState("")
  const [tierToModify, setTierToModify] = React.useState(0)
  const [postTier, setPostTier] = React.useState(0)
  const [postToEdit, setPostToEdit] = React.useState(0)
  const [signalToClaim, setSignalToClaim] = React.useState(0)
  const [treasureToClaim, setTreasureToClaim] = React.useState(0)
  let [searchParams, setSearchParams] = useSearchParams();
  const [treasures, setTreasures] = React.useState([])
  const [signals, setSignals] = React.useState([])
  const [view, setView] = React.useState("main")
  const [judging, setJudging] = React.useState([])
  const [executing, setExecuting] = React.useState([])
  const {getContractData} = useGetContractData()
  const {
    hasData,
    balanceList,
    contractVars,
  } = useContext(ContractContext);

  const showMyIsland = React.useCallback(async () => {
    if (!state.myIslands) return
    if (state.myIslands.length == 1) {
      setIsland(state.myIslands)
    } else {
      setIsland(state.myIslands[state.active])
    }
  })

  const getIslandObjects = (async () => {
    await getContractData(state.scid)
    const scData = contractVars;
    console.log('Get ISL OBJ - scData', scData);
    setTreasures([])
    setSignals([])
    setJudging([])
    let signalArray = []

    const treasureSearch = new RegExp(`${state.myIslands[state.active].name}[0-9]*_bm`)
    var signalSearch = new RegExp(`${state.myIslands[state.active].name}[0-9]*_sm`)
    var judgeSearch = /.*_J\d{1,}/
    var executerSearch = /.*_X\d{1,}/


    // TODO MTS -- commenting out for now -- seems unused -- ask Apollo
    // if (state.myIslands[state.active].tiers) {
    //   for (var t of state.myIslands[state.active].tiers) {
    //     // var supporterSearch = new RegExp(`.*_\\${state.myIslands[state.active].name+t.index}\_E`)
    //     var supporterSearch = new RegExp(`_` + state.myIslands[state.active].name + t.index + `_E`)
    //     t.subs = Object.keys(scData)
    //       .filter(key => supporterSearch.test(key))
    //       .filter(key => scData[key] > new Date().getTime() / 1000)
    //       .map(x => x.substring(0, 66))
    //   }
    // }

    // TODO MTS -- commenting out for now -- seems unused -- ask Apollo
    // let judgeFilter = Object.keys(scData)
    //   .filter(key => judgeSearch.test(key))
    // console.log("JF", judgeFilter)

    if (scData) {
      let judgeList = Object.keys(scData)
        .filter(key => judgeSearch.test(key))
        .map(key => [ContractUtils.hexToString(scData[key.substring(0, key.length - 2) + "bm"]), ContractUtils.hexToString(scData[key]), scData[key.substring(0, key.length - 2) + "T"], scData[key.substring(0, key.length - 2) + "E"], scData[key.substring(0, key.length - 2) + "J"], key.substring(0, key.length - 3), Object.keys(scData).filter(key2 => new RegExp(`${key.substring(0,key.length-1)}*[0-9]`).test(key2)), key])
      console.log("judgeList", judgeList)
      console.log("judgesearch", judgeSearch)
      var judgeArr = []
      for (let i = 0; i < judgeList.length; i++) {
        if (judgeList[i][1] !== state.myIslands[state.active].name || judgeList[i][5].substring(0, judgeList[i][5].length - 1) === state.myIslands[state.active].name) continue
        console.log(judgeList[i][0])
        for await (const buf of state.ipfs.cat(judgeList[i][0].toString())) {
          try {
            let treasure = JSON.parse(buf.toString())

            treasure.judgeList = []
            for (var k = 0; k < judgeList[i][6].length; k++) {
              treasure.judgeList.push(ContractUtils.hexToString(scData[judgeList[i][6][k]]))
            }

            treasure.index = judgeList[i][5].substring(judgeList[i][5].length - 1)
            treasure.expiry = judgeList[i][3]
            treasure.treasure = judgeList[i][2] / 100000
            treasure.judge = judgeList[i][4]

            if (treasure.expiry > new Date().getTime() / 1000) treasure.status = 0

            judgeArr.push(treasure)
          } catch (error) {
            console.log(error)
          }
        }

      }
      setJudging(judgeArr)

      let execList = Object.keys(scData)
        .filter(key => executerSearch.test(key))
        .map(key => [ContractUtils.hexToString(scData[key.substring(0, key.length - 2) + "bm"]), ContractUtils.hexToString(scData[key]), scData[key.substring(0, key.length - 2) + "T"], scData[key.substring(0, key.length - 2) + "E"], scData[key.substring(0, key.length - 2) + "X"], key.substring(0, key.length - 3), Object.keys(scData).filter(key2 => new RegExp(`${key.substring(0,key.length-1)}*[0-9]`).test(key2)), key])

      var execArr = []
      for (let i = 0; i < execList.length; i++) {
        if (execList[i][1] !== state.myIslands[state.active].name || execList[i][5].substring(0, execList[i][5].length - 1) === state.myIslands[state.active].name) continue

        for await (const buf of state.ipfs.cat(execList[i][0].toString())) {
          try {
            let treasure = JSON.parse(buf.toString())

            treasure.judgeList = []
            for (var k = 0; k < execList[i][6].length; k++) {
              treasure.judgeList.push(ContractUtils.hexToString(scData[execList[i][6][k]]))
            }

            treasure.index = execList[i][5].substring(execList[i][5].length - 1)
            treasure.expiry = execList[i][3]
            treasure.treasure = execList[i][2] / 100000
            treasure.executer = execList[i][4]

            if (treasure.expiry > new Date().getTime() / 1000) treasure.status = 0

            execArr.push(treasure)

          } catch (error) {
            console.log(error)
          }
        }

      }
      setExecuting(execArr)
      console.log("EXEC ARR", execArr)

      let treasureList = Object.keys(scData)
        .filter(key => treasureSearch.test(key))
        .map(key => [ContractUtils.hexToString(scData[key]), scData[key.substring(0, key.length - 2) + "E"], scData[key.substring(0, key.length - 2) + "T"], scData[key.substring(0, key.length - 2) + "J"], key.substring(0, key.length - 3), Object.keys(scData).filter(key2 => new RegExp(`\\${state.myIslands[state.active].name+key.substring(key.length-4,key.length-3)}\*_J[0-9]`).test(key2)), scData[key.substring(0, key.length - 2) + "JN"], scData[key.substring(0, key.length - 2) + "JE"], scData[key.substring(0, key.length - 2) + "JT"], Object.keys(scData).filter(key3 => new RegExp(`\\${state.myIslands[state.active].name+key.substring(key.length-4,key.length-3)}\*_X[0-9]`).test(key3)), scData[key.substring(0, key.length - 2) + "XN"], scData[key.substring(0, key.length - 2) + "XE"], scData[key.substring(0, key.length - 2) + "XT"], scData[key.substring(0, key.length - 2) + "X"]])

      var bountyArray = []

      for (let i = 0; i < treasureList.length; i++) {
        for await (const buf of state.ipfs.cat(treasureList[i][0].toString())) {
          try {
            let treasure = JSON.parse(buf.toString())

            treasure.judgeList = []
            for (var k = 0; k < treasureList[i][5].length; k++) {
              treasure.judgeList.push(ContractUtils.hexToString(scData[treasureList[i][5][k]]))
            }
            treasure.executerList = []
            for (var k = 0; k < treasureList[i][9].length; k++) {
              treasure.executerList.push(ContractUtils.hexToString(scData[treasureList[i][9][k]]))
            }

            treasure.index = treasureList[i][4].substring(treasureList[i][4].length - 1)
            treasure.expiry = treasureList[i][1]
            treasure.treasure = treasureList[i][2] / 100000
            treasure.judge = treasureList[i][3]

            if (treasure.expiry > new Date().getTime() / 1000) treasure.status = 0

            bountyArray.push(treasure)

            // setTreasures(treasures=>[...treasures,treasure])
            console.log("fundz", treasures)

          } catch (error) {
            console.log(error)
          }
        }

      }
      setTreasures(bountyArray)
      let fundList = Object.keys(scData)
        .filter(key => signalSearch.test(key))
        .map(key => [ContractUtils.hexToString(scData[key]), scData[key.substring(0, key.length - 2) + "D"], scData[key.substring(0, key.length - 2) + "G"], scData[key.substring(0, key.length - 2) + "R"], scData[key.substring(0, key.length - 2) + "F"], scData[key.substring(0, key.length - 2) + "C"], key.substring(0, key.length - 3)])

      console.log("hash array", fundList)

      for (let i = 0; i < fundList.length; i++) {
        console.log("helllooo", state.ipfs)

        console.log("fundList", fundList)
        for await (const buf of state.ipfs.cat(fundList[i][0].toString())) {
          let fund = JSON.parse(buf.toString())
          console.log("fund.island", fund.island)

          console.log(fundList[i][6].substring(0, fundList[i][6].length - 1))
          //if(fund.island!=fundList[i][6].substring(0,fundList[i][6].length-1)) continue
          fund.island = fundList[i][6].substring(0, fundList[i][6].length - 1)
          fund.index = fundList[i][6].substring(fundList[i][6].length - 1)
          fund.deadline = fundList[i][1]
          fund.goal = fundList[i][2] / 100000
          fund.raised = fundList[i][3]
          fund.fundee = fundList[i][4]
          fund.claimed = fundList[i][5]
          if (fund.deadline > new Date().getTime() / 1000) fund.status = 0
          else if (fund.deadline < new Date().getTime() / 1000 && fund.goal < fund.raised) fund.status = 1
          else if (fund.deadline < new Date().getTime() / 1000 && fund.goal > fund.raised) fund.status = 2
          // setSignals(signals=>[...signals,fund])
          signalArray.push(fund)
        }
      }
      setSignals(signalArray)
    }

  })

  useEffect(() => {
    if (state.scid) {
      console.log('GETTING ISL OBJ')
      getIslandObjects()
    }
  }, [island, searchParams, state.active, state.scid])

  const editIsland = async e => {
    e.preventDefault()
    state.myIslands[state.active][`${editing}`] = e.target.edit.value

    var burn = 100

    var transfers = []
    if (state.cocoBalance < burn) {
      transfers.push({
        "destination": state.randomAddress,
        "burn": burn * 100
      })
    } else {
      transfers.push({
        "destination": state.randomAddress,
        "scid": state.coco,
        "burn": burn
      })
    }

    ////////////code copied from claim page
    var islandData = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 0
      },
      "pinataMetadata": {
        "name": state.myIslands[state.active].name,
        "keyvalues": {}
      },
      "pinataContent": state.myIslands[state.active]
    });

    const islandPinata = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNjc5NzU5MS02OGUxLTQyNzAtYjZhMy01NjBjN2Y3M2IwYTMiLCJlbWFpbCI6ImJhY2tlbmRAYW1icm9zaWEubW9uZXkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDgzZTJkMGQ2Yzg2YTBhNjlkY2YiLCJzY29wZWRLZXlTZWNyZXQiOiJlN2VlMTE4MWM2YTBlN2FmNjQ0YmUzZmEyYmU1ZWY5ZWFmMmNmMmYyYzc0NWQzZGIxNDdiMThhOTU5NWMwZDNlIiwiaWF0IjoxNjYxMTk1NjUxfQ.9Pz2W_h7zCiYyuRuVySKcDwA2fl_Jbm6QDulihAIpmo`
      },

      body: islandData
    });


    const addIsland = await state.ipfs.add(JSON.stringify(state.myIslands[state.active]).toString())
    const M = addIsland.cid.toString()
    const deroBridgeApi = state.deroBridgeApiRef.current

    // TODO - MTS -- Create hook that will do this transfer??  need to set payload in state to trigger??
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
      "scid": state.scid,
      "ringsize": 2,
      "transfers": transfers,
      "sc_rpc": [{
        "name": "entrypoint",
        "datatype": "S",
        "value": "IVU"
      },
        {
          "name": "H",
          "datatype": "S",
          "value": state.myIslands[state.active].name
        },
        {
          "name": "M",
          "datatype": "S",
          "value": M
        },
        {
          "name": "j",
          "datatype": "U",
          "value": state.myIslands[state.active].j
        }
      ]
    }))
    /////////////end copy


    setEditing("")
  }


  // Based on state context, we make call to showMyIsland
  React.useEffect(() => {
    setIsland([])
    showMyIsland()
  }, [state.myIslands])

  const changeTierToModify = e => {
    e.preventDefault()
    setTierToModify(e.target.value)
  }
  const changePostTier = e => {
    e.preventDefault()
    setPostTier(e.target.value)
  }
  const changePostToEdit = e => {
    e.preventDefault()
    setPostToEdit(e.target.value)
  }

  const changeSignalToClaim = e => {
    e.preventDefault()
    setSignalToClaim(e.target.value)
  }
  const changeTreasureToClaim = e => {
    e.preventDefault()
    setTreasureToClaim(e.target.value)
  }


  return (
    <div className="function">
      <div className="profile">
        {state.myIslands ? <>{state.myIslands.length === 0 ?
          <>
            <Feed />
            <FutureFeed />
            <NavLink to="/claimIsland">Claim your own Private Island Here</NavLink>
          </>
          :
          <div>
            <div className="icons">
              {editing === "image" ?
                <>
                  <form onSubmit={editIsland}>
                    <input id="edit" defaultValue={state.myIslands[state.active].image} />
                    <button type="submit">Submit</button>
                  </form>
                  <small onClick={() => setEditing("")}>cancel</small></>
                :
                <>
                  <img src={state.myIslands[state.active].image} />
                  <small onClick={() => setEditing("image")}>edit</small>
                </>} <h1 onClick={() => {
              setView("main")
            }}>{state.myIslands[state.active].name}</h1></div>

            {view === "main" ? <>
                <>{editing === "tagline" ?
                  <>
                    <form onSubmit={editIsland}>
                      <input id="edit" defaultValue={state.myIslands[state.active].tagline} />
                      <button type="submit">Submit</button>
                    </form>
                    <small onClick={() => setEditing("")}>cancel</small></>
                  : <><p>{state.myIslands[state.active].tagline}</p>
                    <small onClick={() => setEditing("tagline")}>edit</small>
                  </>
                }</>
                <>{editing === "bio" ?
                  <>
                    <form onSubmit={editIsland}>
                      <textarea rows="44" cols="80" id="edit" defaultValue={state.myIslands[state.active].bio} />
                      <button type="submit">Submit</button>
                    </form>
                    <small onClick={() => setEditing("")}>cancel</small></>
                  : <><p dangerouslySetInnerHTML={{__html: state.myIslands[state.active].bio}} />
                    <small onClick={() => setEditing("bio")}>edit</small>
                  </>
                }</>
              </>
              : view === "treasure" ?
                <>
                  <NavLink to={`/burytreasure/${state.myIslands[state.active].name}/${treasures.length}`}>Bury New
                    Treasure</NavLink>
                  {treasures.length > 0 ? <><h3>Bounties You Initiated</h3>
                    <div className="card-grid">

                      {treasures.map(x => <TreasureCard className="mytreasure" executerList={x.executerList}
                                                        name={x.name} profile={x.island} tagline={x.tagline}
                                                        treasure={x.treasure} image={x.image} judgeList={x.judgeList}
                                                        index={x.index} />)}
                    </div>
                  </> : <p>No Buried Treasures yet</p>}
                  {judging.length > 0 ? <><h3>Nominated for Judge</h3>
                    <div className="card-grid">

                      {judging.map(x => <TreasureCard className="mytreasure" name={x.name} profile={x.island}
                                                      tagline={x.tagline} treasure={x.treasure} image={x.image}
                                                      judgeList={x.judgeList} index={x.index} />)}
                    </div>
                  </> : ""}

                  {executing.length > 0 ? <><h3>Nominated for Executer</h3>
                    <div className="card-grid">

                      {executing.map(x => <TreasureCard className="mytreasure" name={x.name} profile={x.island}
                                                        tagline={x.tagline} treasure={x.treasure} image={x.image}
                                                        executerList={x.judgeList} index={x.index} />)}
                    </div>
                  </> : ""}


                </>
                : view == "signal" ? <>
                    <NavLink to={`/newsignal/${state.myIslands[state.active].name}/${signals.length}`}>Start New Smoke
                      Signal</NavLink>
                    {signals.length > 0 ? <>
                      {signals.map(x => <NavLink to={`/island/${x.island}/smokesignal/${x.index}`}><FundCard name={x.name}
                                                                                                             profile={x.island}
                                                                                                             tagline={x.tagline}
                                                                                                             goal={x.goal}
                                                                                                             image={x.image}
                                                                                                             deadline={x.deadline} /></NavLink>)}
                    </> : <><p>No Smoke Signals Yet</p>
                    </>}
                  </>
                  : view == "mail-in" ? <>
                      <button onClick={() => {
                        setView("mail-in")
                      }}>Incoming
                      </button>
                      <button onClick={() => {
                        setView("mail-out")
                      }}>Outgoing
                      </button>

                      <Feed />

                    </>
                    : view == "mail-out" ? <>
                        <button onClick={() => {
                          setView("mail-in")
                        }}>Incoming
                        </button>
                        <button onClick={() => {
                          setView("mail-out")
                        }}>Outgoing
                        </button>
                        <h3>Your Subscription Tiers</h3>
                        {state.myIslands[state.active].tiers.map(t => <p>{t.name}, subs:{t.subs.length}<NavLink
                          to={`/island/${state.myIslands[state.active].name}/modifytier/${t.index}`}>Edit</NavLink></p>)}
                        <NavLink to={`/island/${state.myIslands[state.active].name}/compose`}>Put a Message in a
                          Bottle</NavLink>
                        <NavLink
                          to={`/island/${state.myIslands[state.active].name}/modifytier/${state.myIslands[state.active].tiers.length}`}>New
                          Subscription Tier</NavLink>
                      </>
                      : ""}

            <div className="icons">
              <div className="icons-treasure" onClick={() => {
                setView("treasure")
              }}>
                <div className="icons-text">Bounties</div>
              </div>
              <div className="icons-signal" onClick={() => {
                setView("signal")
              }}>
                <div className="icons-text">Fundraisers</div>
              </div>
              <div className="icons-mail" onClick={() => {
                setView("mail-in")
              }}>
                <div className="icons-text">Subscriptions</div>
              </div>
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


        }</> : <h3>Loading...</h3>}


      </div>
    </div>
  )
}