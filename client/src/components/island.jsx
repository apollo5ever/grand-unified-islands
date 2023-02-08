import {useContext, useEffect, useMemo, useState} from 'react'
import {LoginContext} from '../LoginProvider';
import {NavLink, useParams, useSearchParams} from 'react-router-dom'
import TreasureCard from './treasureCard';
import FundCard from './fundCard';
import TrustIsland from './trustIsland';
import {useGetIslands} from '../hooks/useGetIslands';
import {useGetIslandObjects} from '../hooks/useGetIslandObjects';


export default function Island() {
  const {state} = useContext(LoginContext);
  const [post, setPost] = useState([])
  const [editing, setEditing] = useState("")
  const [tierToModify, setTierToModify] = useState(0)
  const [postTier, setPostTier] = useState(0)
  const [postToEdit, setPostToEdit] = useState(0)
  const [signalToClaim, setSignalToClaim] = useState(0)
  const [treasureToClaim, setTreasureToClaim] = useState(0)
  let [searchParams, setSearchParams] = useSearchParams();
  const [treasures, setTreasures] = useState([])
  const [judging, setJudging] = useState([])
  const [signals, setSignals] = useState([])
  const [bottles, setBottles] = useState([])
  const [trust, setTrust] = useState(0)
  const [view, setView] = useState("main")
  const params = useParams()
  const {getIslands} = useGetIslands()
  const {bottle, treasure, signal, judge} = useGetIslandObjects(params.island, post)

  /*
  const getTXHistory = React.useCallback(async () => {
    const deroBridgeApi= state.deroBridgeApiRef.current
    const [err,res] = await to(deroBridgeApi.wallet('get'))
  })
  */

  useEffect(() => {
    console.log('Treasure from useGIHook', treasure, state.treasure)
  }, [post, searchParams, state.ipfs])

  useMemo(async () => {
    if (state.ipfs) {
      setPost(await getIslands(params.island))
    }
  }, [state.ipfs, state.myIslands])

  const postFiltered = post.filter((i, x) => {
    if (searchParams.get("index") && x != searchParams.get("index")) return
    return (i)
  })
  console.log('POST FILTERED', postFiltered)

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
        <>{postFiltered.length === 0 ?
          <p>Loading...</p>
          : postFiltered.length === 1 ?
            <div>
              <div className="icons">
                <img src={postFiltered[0].image} />
                <h1 onClick={() => setSearchParams({"view": "main"})}>{postFiltered[0].name}</h1></div>
              {searchParams.get("view") == "main" ? <>
                  <p>{postFiltered[0].tagline}</p>
                  <p>Social Coconut Score:{trust ? trust : "Not trusted by any island operators"}</p>
                  <p dangerouslySetInnerHTML={{__html: postFiltered[0].bio}} />
                </>
                : searchParams.get("view") == "treasure" ?
                  <>{treasures.length > 0 ? <>
                    {treasures.map(x => <TreasureCard className="mytreasure" name={x.name} profile={x.island}
                                                      tagline={x.tagline} treasure={x.treasure} image={x.image}
                                                      judgeList={x.judgeList} index={x.index} />)}
                  </> : <p>No Buried Treasures yet</p>}
                    {judging.length > 0 ? <>
                      {judging.map(x => <TreasureCard className="mytreasure" name={x.name} profile={x.island}
                                                      tagline={x.tagline} treasure={x.treasure} image={x.image}
                                                      judgeList={x.judgeList} index={x.index} />)}
                    </> : <p>No Judging any treasure</p>}

                  </>
                  : searchParams.get("view") == "signal" ? <>
                      {signals.length > 0 ? <>
                        {signals.map(x => <NavLink to={`/island/${x.island}/smokesignal/${x.index}`}><FundCard
                          name={x.name} profile={x.island} tagline={x.tagline} goal={x.goal} image={x.image}
                          deadline={x.deadline} /></NavLink>)}
                      </> : <><p>No Smoke Signals Yet</p>
                      </>}
                    </>
                    : searchParams.get("view") == "mail" ? <>

                        {bottles}</>
                      : ""}

              <div className="icons">
                <div className="icons-treasure" onClick={() => setSearchParams({"view": "treasure"})}>
                  <div className="icons-text">Bounties</div>
                </div>
                <div className="icons-signal" onClick={() => setSearchParams({"view": "signal"})}>
                  <div className="icons-text">Fundraisers</div>
                </div>
                <div className="icons-mail" onClick={() => setSearchParams({"view": "mail"})}>
                  <div className="icons-text">Subscriptions</div>
                </div>
              </div>
            </div>
            :
            <div><h1>Choose your Island</h1>
              {postFiltered.map((x, i) => <h2 onClick={() => setSearchParams({"index": i})}>{x.name}</h2>)}
            </div>
        }</>
      </div>
      {state.myIslands && state.myIslands.length > 0 ? <TrustIsland island={params.island} /> : ""}
    </div>
  )
}