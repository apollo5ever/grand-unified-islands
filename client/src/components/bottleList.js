import {useContext, useEffect, useMemo, useState} from 'react'
import {ContractContext} from './providers/contractProvider';
import {LoginContext} from '../LoginProvider';
import {useGetContractData} from '../hooks/useGetContractData';
import {useGetIslands} from '../hooks/useGetIslands';
import {useGetMIB} from '../hooks/useGetMIB';
import '../App.css'

// Gets called when archipelago is filtered by 'mib'
export default function BottleList(props) {
  const [tiers, setTiers] = useState([])
  const {stringKeys} = useContext(ContractContext);
  const {state} = useContext(LoginContext);
  const {getContractData} = useGetContractData()
  const {getIslands} = useGetIslands()
  const {getMIBs} = useGetMIB()

  const getTiers = async () => {
    let tierList = []
    let islands = await getIslands(props.state.island)
    for (let i = 0; i < islands.length; i++) {
      tierList = tierList.concat(await getMIBs(stringKeys, islands[i], -1))
    }
    setTiers(tierList)
  }

  // When this loads, we need to put contract data into contract context
  useEffect(() => {
    (async () => {
      await getContractData(state.scid)
    })()
  }, [])

  // When contract data is written to context, we call getTiers which will fetch MIBs & format into <Subscribe />
  useMemo(() => {
    if (stringKeys) {
      getTiers()
    }
  }, [stringKeys])

  return (
    <><h1>Island Subscriptions</h1>{tiers.map((x, index) => <div className="function" key={index}>{x}</div>)}</>
  )
}