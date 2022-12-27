import {useCallback, useContext} from 'react';
import * as IPFS from 'ipfs-core';
import {IpfsParams} from '../enums/DeroContractConstants';
import {LoginContext} from '../LoginProvider';

export const useGetIPFS = () => {
  const {setState} = useContext(LoginContext);

  const getIPFS = useCallback(async () => {
    const ipfsBoy = await IPFS.create()
    const validIp4 = IpfsParams.VALID_IP4
    const rez = await ipfsBoy.bootstrap.add(validIp4);
    try {
      await ipfsBoy.config.getAll();
      console.log('IPFSBOY =', ipfsBoy);
      setState((state) => ({...state, ipfs: ipfsBoy}));
    } catch (err) {
      console.log('Error useGetIPFS - ipfsBoy', err);
    }
  }, [])

  return {getIPFS}
}