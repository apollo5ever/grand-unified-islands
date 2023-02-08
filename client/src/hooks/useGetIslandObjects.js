import {useContext, useEffect, useMemo, useState} from 'react';
import {LoginContext} from '../LoginProvider';
import getFundraisers from '../components/getFundraisers';
import {useGetBounties} from './useGetBounties';
import {useGetMIB} from './useGetMIB';

/*
  This code is from island.jsx's version
  There is a getIslandObjects in myIsland.jsx, which I need to sort out
  to see if its the same as this &/or combine them into this hook
 */
export const useGetIslandObjects = (island, post) => {
  // TODO Add some judging stuff - see island.jsx as it as a getIslandObjects too???
  console.log('IN USE  GET ISLAND OBJ', island, post)
  const {state} = useContext(LoginContext);
  const [treasure, setTreasure] = useState([])
  const [judge, setJudge] = useState([])
  const [signal, setSignal] = useState([])
  const [bottle, setBottle] = useState([])
  const {getBounties} = useGetBounties()
  const {getMIBs} = useGetMIB()

  // setBottles(getMIB(filteredIsland, -1, state))
  // setTreasures(getBounties(params.island))
  useEffect(() => {
    (async () => {
      setTreasure(await getBounties(island))
      setBottle(await getMIBs(island, -1))
      // TODO MTS this needs to be swapped out with hook when written
      setSignal(await getFundraisers(state, island))
    })()
  }, [island])

  return {bottle, treasure, signal, judge}
}
