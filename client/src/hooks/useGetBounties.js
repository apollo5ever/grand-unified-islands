import {useCallback, useContext} from 'react';
import {BridgeContext} from '../components/providers/bridgeProvider';
import {LoginContext} from '../LoginProvider';
import {IslandUtils} from '../utils/islandHelper';
import {useGetContractData} from './useGetContractData';
import {ContractContext} from '../components/providers/contractProvider';
import {ContractUtils} from '../utils/contractHelper';
import hex2a from '../components/hex2a';

export const useGetBounties = () => {
  const {state, setState} = useContext(LoginContext);
  const {getContractData} = useGetContractData()
  const {
    stringKeys,
  } = useContext(ContractContext);

  const getBounties = useCallback(async (island = '') => {
    console.log('IN GET BOUNTIES')
    await getContractData(state.scid)
    const fundList = ContractUtils.getFundList(stringKeys)
    let bounties = [];
    console.log('BOUNTY FUND LIST', fundList)

    if (IslandUtils.onPrivateIslandsDomain()) {
      console.log('On a PI domain, api/islands/bounties call');
      const response = await fetch('/api/islands/bounties');
      bounties = await response.json();
      if (response.status !== 200) throw Error(bounties.message);
    } else {
      /*
        Try from local host as they might be running an island node
       */
      try {
        const response = await fetch('http://127.0.0.1:5000/islands/bounties');
        bounties = await response.json();
        if (response.status !== 200) throw Error(bounties.message);
      } catch (errLocalHost) {
        /*
          Try getting fund list from IPFS to create bounties array
         */
        for (let i = 0; i < fundList.length; i++) {
          for await (const buf of state.ipfs.cat(fundList[i][0].toString())) {
            try {
              let fund = JSON.parse(buf.toString())
              bounties.push(fund)
            } catch (error) {
              console.log(error)
            }
          }
        }
      }
    }

    // TODO Copied this from getBoutnies.js as is
    // TODO need to change getIslandObjects too b4 I can see if this works
    console.log('BOUNTIES', bounties)
    for (var i = 0; i < bounties.length; i++) {
      let fund = bounties[i]

      if (fund.island != fundList[i][4].substring(0, fundList[i][4].length - 1)) continue

      fund.index = fundList[i][4].substring(fundList[i][4].length - 1)
      fund.expiry = fundList[i][1]
      fund.treasure = fundList[i][2] / 100000
      if (fundList[i][3]) {
        fund.judge = hex2a(fundList[i][3])
        fund.judgeAddress = hex2a(scData[`${fund.judge}_O`])
      }
      fund.judgeList = []
      fund.JN = parseInt((fundList[i][6] + 1 + (new Date().getTime() / 1000 - fundList[i][7]) / 1209600) % fundList[i][8])
      if (new Date().getTime() / 1000 > fundList[i][7]) {
        fund.JE = Math.round(1209600 - (new Date().getTime() / 1000 - fundList[i][7]) % 1209600)
      } else fund.JE = Math.round(fundList[i][7] - new Date().getTime() / 1000)
      for (var k = 0; k < fundList[i][5].length; k++) {
        fund.judgeList.push(hex2a(scData[fundList[i][5][k]]))
      }

      if (fundList[i][13]) fund.executer = hex2a(fundList[i][13])
      fund.executerList = []
      fund.XN = parseInt((fundList[i][10] + 1 + (new Date().getTime() / 1000 - fundList[i][11]) / 1209600) % fundList[i][12])
      if (new Date().getTime() / 1000 > fundList[i][7]) {
        fund.XE = Math.round(1209600 - (new Date().getTime() / 1000 - fundList[i][11]) % 1209600)
      } else fund.XE = Math.round(fundList[i][11] - new Date().getTime() / 1000)


      //fund.XE = Math.round(300-(new Date().getTime()/1000-fundList[i][11])%300)
      //fund.tXE = fundList[i][11]
      for (var k = 0; k < fundList[i][9].length; k++) {
        fund.executerList.push(hex2a(scData[fundList[i][9][k]]))
      }
      fund.recipientList = []
      for (var k = 0; k < fundList[i][14].length; k++) {
        fund.recipientList.push(hex2a(scData[fundList[i][14][k]]))
      }
      fund.weightList = []
      fund.weightSum = 0
      for (var k = 0; k < fundList[i][15].length; k++) {
        fund.weightSum += scData[fundList[i][15][k]]
        fund.weightList.push(scData[fundList[i][15][k]])
      }
      fund.weightList = fund.weightList.map(x => <>weight: {x} ({Math.round(100 * x / fund.weightSum)}%)</>)
      fund.recipientList = fund.recipientList.map((x, i) => <li>{x} {fund.weightList[i]}</li>)
      fund.JF = fundList[i][16]
      if (fund.expiry > new Date().getTime() / 1000 && fund.JF != 2) fund.status = 0
      else if (fund.JF == 2) fund.status = 1
      else if (fund.expiry < new Date().getTime() / 1000 && fund.JF != 2) fund.status = 2

      if (i == bounties.length - 1) {
        if (island) {
          console.log("filtered by island ", island)
          console.log(bounties.filter(x => x.island == island))
          return (bounties.filter(x => x.island == island))
        } else return (bounties)
      }
    }
  }, [stringKeys])

  return {getBounties}
  }