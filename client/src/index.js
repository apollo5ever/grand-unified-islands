import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';
import About from './components/about'
import FundList from './components/fundList'

import Fundraiser from './components/fundraiser';
import CreateFund from './components/addFundraiser'
import BuryTreasure from './components/buryTreasure';

import {LoginProvider} from './LoginContext'

import OAO from './components/oao'
import CEO from './components/ceo'
import BountyList from './components/bountyList';
import Treasure from './components/treasure';
import MyIsland from './components/myIsland';
import ClaimIsland from './components/claimIsland';
import IslandList from './components/islandList';
import Island from './components/island';
import PublishPost from './components/publishPost';
import ModifyTier from './components/modifyTier'



ReactDOM.render(
  
  <LoginProvider>
  <HashRouter>
  <Routes className="main">
    <Route path="/" element={<App/>}>
      <Route path="/about" element={<About/>}/>
     <Route path="/island/:island" element={<Island/>}/>
      <Route path="/island/:island/smokesignal/:index" element={<Fundraiser/>}/>
      <Route path="/island/:island/treasure/:index" element={<Treasure/>}/>
      <Route path="about" element={<About />}/>
      <Route path="smokesignals" element={<FundList />} />
      <Route path="treasure" element={<BountyList/>}/>
      <Route path="/newsignal/:island/:index" element={<CreateFund/>}/>
      <Route path="/burytreasure/:island/:index" element={<BuryTreasure/>}/>
      <Route path="/oao" element={<OAO/>}/>
      <Route path="/ceo" element={<CEO/>}/>
      <Route path="myisland" element={<MyIsland/>}/>
      <Route path="claimisland"element={<ClaimIsland/>}/>
     <Route path="archipelago" element={<IslandList/>}/>
     <Route path="/island/:island/compose" element={<PublishPost/>}/>
     <Route path="/island/:island/modifytier/:tier" element={<ModifyTier/>}/>
    </Route>
  </Routes>
  
</HashRouter>
</LoginProvider>

  , document.getElementById('root'));

