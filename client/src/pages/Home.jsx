// TODO create home pages for each feature (Bounties, Fundraisers, Subscriptions)
import React, {useContext, useEffect, useRef, useState,} from "react";
import "../App.css";
import {NavLink, Outlet} from "react-router-dom";
import {LoginContext} from "../LoginProvider";
import {BridgeContext} from '../components/providers/bridgeProvider';
import SelectIsland from "../components/selectIsland";
import logotransparent from "../assets/logotransparent.png";
import * as FaIcons from "react-icons/fa";
import {Helmet} from "react-helmet-async";
import {useGetIPFS} from '../hooks/useGetIPFS';
import {useGetWalletAddress} from '../hooks/useGetWalletAddress';
import {useGetPIScid} from '../hooks/useGetPIScid';
import {useGetRandomAddress} from '../hooks/useGetRandomAddress';
import {useGetCocoBalance} from '../hooks/useGetCocoBalance';
import {useGetMyIslands} from '../hooks/useGetMyIslands';

import {useParams} from 'react-router-dom';

export const PrivateIslandsHome = () => {
  const {deroBridgeApi, deroBridgeStatus} = useContext(BridgeContext);
  const {state, setState} = useContext(LoginContext);
  const [menuActive, setMenuActive] = useState(false);
  const {getAddress} = useGetWalletAddress();
  const {getIPFS} = useGetIPFS();
  const {getPiContract} = useGetPIScid();
  const {getRandomAddress} = useGetRandomAddress();
  const {getCocoBalance} = useGetCocoBalance();
  const {getMyIslands} = useGetMyIslands();
  const params = useParams()

  useEffect(() => {
    console.log('PARAMS =', params, window.location.href);
    getIPFS();
  }, []);

  useEffect(() => {
    getAddress();
    getRandomAddress();
    getPiContract();
  }, [deroBridgeApi]);

  useEffect(() => {
    if (state.coco) {
      getCocoBalance(state.coco);
      console.log('Getting coco bal for scid: ', state.coco);
    }
  }, [state.coco, state.userAddress]);

  useEffect(() => {
    if (state.ipfs) {
      getMyIslands(state.scid);
    }
  }, [state.ipfs, state.scid, state.userAddress]);

  function toggleMenuActive() {
    if (menuActive) {
      setMenuActive(false);
      return;
    }
    if (!menuActive) {
      setMenuActive(true);
      return;
    }
  }

  return (
    <>
      <Helmet>
        <title>Private Islands</title>
      </Helmet>
      <div className="App">
        <div className="navbar">
          <img src={logotransparent} className="nav-logo" />
          <h1 className="nav-header">Dero Private Islands</h1>
          <div className="menu-bars" onClick={() => toggleMenuActive()}>
            <FaIcons.FaBars size={40} />
          </div>
        </div>
        <div
          className={menuActive ? "dropdown-menu" : "dropdown-menu inactive"}
        >
          <NavLink className="navlink" to="archipelago">
            <div className="navlink-text">Explore Archipelago</div>
          </NavLink>
          <NavLink className="navlink" to="claimisland">
            <div className="navlink-text">Claim Your Private Island</div>
          </NavLink>
          <NavLink className="navlink" to="myisland">
            <div className="navlink-text">My Island</div>
          </NavLink>
          <NavLink className="navlink" to="about?view=features">
            <div className="navlink-text">About</div>
          </NavLink>
          <NavLink className="navlink" to="oao">
            <div className="navlink-text">OAO</div>
          </NavLink>
        </div>

        <div className="rpc-bridge-data"></div>

        <Outlet />
        <h3>Coco Balance: {state.cocoBalance}</h3>
        <SelectIsland />
        {deroBridgeStatus}
        <small
          onClick={() => {
            // getAddress();
          }}
        >
          Refresh Wallet
        </small>
      </div>
    </>
  );
};
