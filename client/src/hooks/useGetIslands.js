import {useCallback, useContext} from 'react';
import to from 'await-to-js';
import {BridgeContext} from '../components/providers/bridgeProvider';
import {LoginContext} from '../LoginProvider';
import {IslandUtils} from '../utils/islandHelper';

export const useGetIslands = () => {
  const {deroBridgeApi} = useContext(BridgeContext);
  const {state} = useContext(LoginContext);
  /*
    Four cascading attempts to get data
    1 - if using domain 'privateislands.fund
      - make api call to node server which runs on the island node
        that the domain resolves to
      - gets data from local mongoDb instance where ipfs data is copied to
    2 - if user is running their own island node
      - call /islands from localhost
      - gets data from local mongoDb instance where ipfs data is copied to
    3 - if rpc bridge connected
      - call proxied by rpc bridge to get contract data from chain
    4 - if none of the above, use the community node to make rpc call
      - call to get data from chain without the bridge proxy
   */
  const getIslands = useCallback(async (island = '') => {
    if (IslandUtils.onPrivateIslandsDomain()) {
      console.log('On a PI domain, api/islands call');
      const response = await fetch('/api/islands')
      const islands = await response.json()
      if (response.status !== 200) throw Error(islands.message)

      // If island is passed in, lets filter
      if (island) {
        return (islands.filter(item => item.name === island))
      }
      return (islands)
    } else {
      /*
        Try from localhost in case the user runs their own island node
        Use a try catch, cuz if this fails, we will make calls to on chain data
       */
      try {
        console.log('Trying 127 url for local island node')
        const response = await fetch('http://127.0.0.1:5000/islands')
        const islands = await response.json()
        if (response.status !== 200) throw Error(islands.message)

        // If island is passed in, lets filter
        if (island) {
          return (islands.filter(item => item.name === island))
        }
        return islands
      } catch(errLocalHost) {
        console.log('No local nodes, will query chain')
        let scData = undefined;
        if (deroBridgeApi && state.scid) {
          try {
            const [err, res] = await to(deroBridgeApi.daemon("get-sc", {
              scid: state.scid,
              code: false,
              variables: true,
              })
            );
            scData = res.data.result.stringkeys
          } catch (errBridge) {
            console.log('Error trying to get via bridge', errBridge)
          }
        }

        // If scData not set yet, lets try community node
        if (!scData) {
          const res = await IslandUtils.getPrivateIslandFromCommunityNode()
          if (res && res.result.stringkeys) {
            scData = res.result.stringkeys
          }
        }

        // We hopefully have scData now, so let's extract the islands
        if (scData && state.ipfs) {
          return await IslandUtils.getIslandsFromScData(state, scData, island)
        }
      }
    }
  }, [deroBridgeApi, state.ipfs])

  return {getIslands}
}