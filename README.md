
# Private Islands 
## Notes by/for MosesTheSweed
### Notes are dynamic & likely inaccurate as I am writing things down as I figure them out or have questions
## 3 Main Feature
 - Bounties
 - Fund Raisers
 - Subscriptions
## Architecture, Data Flow & Management
 1. Metadata stored on chain in SC
 2. Data downloaded from IPFS & stored in MangoDb
 3. Custom/local IPFS node if user is running their own island node
## Refactoring Steps
Moved all code out of App.js (other than providers & routing) to a Home/landing page

Created pages/Home.jsx -- default/root route '/' landing page

Creating some hooks to make bridge api calls instead of repeating fetch code inline


## To Run Locally
1. In src directory, run `yarn`
2. In client directory, run `yarn`
3. In client directory, run `yarn start`

The latter starts 1 server locally:
 - Web server at `localhost:3000`
 - Node server at `localhost:5000` does not start as this code is outdated


## Data Structure Notes
`_M` - ipfs content id (hex)

`_O` - owner id (hex encoded wallet address)

## Random Notes 
Hook useGetMyIslands requires a contract id to get list of islands for that user/contract

Hook useGetIslands gets all islands or a specific island if island is passed in
 - It tries 4 ways to get data
   - api call to local island node server if connected to privateislands.fund domain
   - api call to local island node server the user might be running
   - rpc bridge call to on chain data 
   - rpc call to community node with out the bridge

### TODO
 - If rpc not connected (community node) should 'myIsland' from nav menu work?  I'm seeing err - test on privateislands.fund
 - Rewrite getIslandObjects.js -- Creating a hook -- requires rewrites of getBounties, getMIB, getFundraisers
 - getBounties.js -- Created a hook 'useGetBounties' -- not sure its working 100% -- Still can clean up quite a bit in the hook
 - getMIB.js -- Created a hook useGetMIB -- deprecated getMIB.js
 - started editing myIsland.jsx -- seems stable, but lots to figure out & restructure
 - started editing island.jsx -- removed getIslandObjects code & replaced with the useGetIslandObjects hook -- lots more to refactor
 - getFundraisers is next -- (Feb 7, 2023)

### Done (for now)
- deprecated getIslands.js -- using useGetIslands hook now
- deprecated getMIB.js -- using useGetMIB hook now
- updated islandList.js to use the getIslands hook
- modified bottleList.js -- good for now, but revisit -- es6 func & perhaps modify overall structure?
