import {useCallback, useContext} from 'react';
import to from 'await-to-js';
import {BridgeContext} from '../components/providers/bridgeProvider';
import {LoginContext} from '../LoginProvider';

export const useGetWalletAddress = () => {
  const {deroBridgeApi} = useContext(BridgeContext);
  const {setState} = useContext(LoginContext);

  const getAddress = useCallback(async () => {
    if (deroBridgeApi) {
      try {
        const [err, res] = await to(deroBridgeApi.wallet('get-address'));
        if (res) {
          console.log('Wallet Address', res.data.result.address);
          setState((state) => ({...state, userAddress: res.data.result.address}))
        }
      } catch(err) {
        console.log('ERROR getting address', err);
      }
    }
  }, [deroBridgeApi])

  return {getAddress}
}