import {createContext, useEffect, useRef, useState} from 'react';
import DeroBridgeApi from 'dero-rpc-bridge-api';
import to from "await-to-js";
export const BridgeContext = createContext({});

export const BridgeProvider = ({children}) => {
  const [deroBridgeApi, deroBridgeApiSet] = useState();
  const [deroBridgeStatus, deroBridgeStatusSet] = useState('disconnected');
  const value = {
    deroBridgeApi,
    deroBridgeStatus,
  }

  const deroBridgeApiRef = useRef()
  useEffect(() => {
    const load = async () => {
      deroBridgeApiRef.current = new DeroBridgeApi()
      const deroBridgeApi = deroBridgeApiRef.current
      const [err] = await to(deroBridgeApi.init())
      if (err) {
        deroBridgeStatusSet(
          <a
            href="https://chrome.google.com/webstore/detail/dero-rpc-bridge/nmofcfcaegdplgbjnadipebgfbodplpd"
            target="_blank"
            rel="noopener noreferrer"
          >
            Not connected to extension. Download here.
          </a>
        )
      } else {
        deroBridgeApiSet(deroBridgeApiRef.current)
        deroBridgeStatusSet('RpcBridge Connected')
      }
    }

    window.addEventListener('load', load)
    return () => window.removeEventListener('load', load)
  }, [])

  return (
    <BridgeContext.Provider value={value}>{children}</BridgeContext.Provider>
  );
}