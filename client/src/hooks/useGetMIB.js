import {useCallback, useContext} from 'react';
import {LoginContext} from '../LoginProvider';
import Subscribe from '../components/subscribe';

// Because of the way this is typically used (within a loop), we need to get the contract data (stringKeys)
//  outside this hook and pass it in until/unless I can use something like SWR or ReactQuery to with the bridge api
export const useGetMIB = () => {
  const {state} = useContext(LoginContext);

  const getMIBs = useCallback(async (stringKeys, island, index) => {
    const bottleSearch = new RegExp(island.name + `\\d*_Av`)
    console.log('useGetMib - scid, contractvars', state.scid, stringKeys)
    if (stringKeys) {
      // TODO MTS - the 'dba' value for Subscribe can be removed once I rewrite Subscribe -- rn I'm not sure its set anyway
      let tierList = Object.keys(stringKeys)
        .filter(key => bottleSearch.test(key))
        .map(key => <Subscribe profile={island.name}
                               name={island.tiers[key.substring(key.length - 4, key.length - 3)].name}
                               index={key.substring(key.length - 4, key.length - 3)}
                               perks={island.tiers[key.substring(key.length - 4, key.length - 3)].perks}
                               amount={stringKeys[key.substring(0, key.length - 2) + "Am"]}
                               interval={stringKeys[key.substring(0, key.length - 2) + "I"]} userAddress={state.userAddress}
                               dba={state.deroBridgeApiRef} scid={state.scid} randomAddress={state.randomAddress}
                               available={stringKeys[key.substring(0, key.length - 2) + "Av"]} />)

      if (index === -1) {
        console.log('getMIBS Tierlist', tierList)
        return (tierList)
      }
      return (tierList[index])
    }
  }, [])

  return {getMIBs}
}