import {useContext, useEffect, useMemo, useState} from 'react'
import {NavLink, useSearchParams} from 'react-router-dom';
import IslandCard from './islandCard';
import {LoginContext} from '../LoginProvider';
import BountyList from './bountyList';
import FundList from './fundList';
import BottleList from './bottleList';
import {IslandUtils} from '../utils/islandHelper';
import {useGetIslands} from '../hooks/useGetIslands';

export default function IslandList() {
  const [islands, setIslands] = useState([])
  const [shuffledIslands, setShuffledIslands] = useState([]);
  const {state} = useContext(LoginContext);
  let [searchParams, setSearchParams] = useSearchParams();
  const {getIslands} = useGetIslands();

  useMemo(async () => {
    if (state.ipfs) {
      setIslands(await getIslands())
    }
  }, [state.ipfs])

  // shuffle the array and update the state
  useEffect(() => {
    setShuffledIslands(IslandUtils.shuffleArray(islands));
  }, [islands]);

  return (
    <div className="function">
      <NavLink to={`/archipelago`}><h1>The Archipelago</h1></NavLink>
      <div className="icons">
        <div className="icons-treasure" onClick={() => {
          setSearchParams({filter: "treasure"})
        }}>
          <div className="icons-text">Bounties</div>
        </div>
        <div className="icons-signal" onClick={() => {
          setSearchParams({filter: "smokesignals"})
        }}>
          <div className="icons-text">Fundraisers</div>
        </div>
        <div className="icons-mail" onClick={() => {
          setSearchParams({filter: "mib"})
        }}>
          <div className="icons-text">Subscriptions</div>
        </div>
      </div>
      {!searchParams.get("filter") ?
        <>
          <div className="profile-card-grid">
            {islands && islands.map(bio => {
              return (
                <NavLink to={`/island/${bio.name}?view=main`} key={bio.name}>
                  <IslandCard name={bio.name} tagline={bio.tagline} image={bio.image} />
                </NavLink>)
            })}
          </div>
        </>
        : searchParams.get("filter") === "treasure" ? <BountyList />
          : searchParams.get("filter") === "smokesignals" ? <FundList />
            : searchParams.get("filter") === "mib" ? <BottleList state={state} />
              : ""}
    </div>
  )

}
