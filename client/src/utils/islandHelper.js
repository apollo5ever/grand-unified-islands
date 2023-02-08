import {CommunityNode, PrivateIslands} from '../enums/DeroContractConstants';
import hex2a from '../components/hex2a';

export class IslandUtils {
  static shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
  }

  static onPrivateIslandsDomain = () => {
    return PrivateIslands.domains.some(val => val.match(new RegExp(window.location.href, 'i')))
  }

  static getPrivateIslandFromCommunityNode = async () => {
    const data = JSON.stringify({
      "jsonrpc": "2.0",
      "id": "1",
      "method": "DERO.GetSC",
      "params": {
        "scid": PrivateIslands.SCID,
        "code": false,
        "variables": true
      }
    });
    let res = await fetch(CommunityNode.URL, {
      method: 'POST',
      body: data,
      headers: {'Content-Type': 'application/json'}
    })

    return await res.json()
  }

  static getIslandsFromScData = async (state, scData, island) => {
    let islands = []
    let search
    if (island) {
      search = new RegExp(`${island}_M`)
    } else {
      search = new RegExp(`.*_M`)
    }

    const islandList = Object.keys(scData)
      .filter(key => search.test(key))
      .map(key => hex2a(scData[key]))

    console.log('ISLAND LIST LENGTH = ', islandList.length, islandList)
    for (let i = 0; i < islandList.length; i++) {
      for await (const buf of state.ipfs.cat(islandList[i].toString())) {
        try {
          islands.push(JSON.parse(buf.toString()))
        } catch (err) {
          console.log('Error parsing islands from ipfs data', err)
        }
      }
    }

    if (island) {
      return (islands.filter(item => item.name === island))
    }

    return (islands)
  }
}
