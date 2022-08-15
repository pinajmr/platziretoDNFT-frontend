// import Head from "next/head";
// import Image from "next/image";
// import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi } from "./contract/abi-contract";
import { binary } from "./contract/binary-contract";
let contractAddress;

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);
  const [isDeployed, setIsDeployed] = useState(false);
  const [isMint, setIsMint] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });
        setIsConnected(true);
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        setSigner(provider.getSigner());
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }

  async function deploy() {
    if (typeof window.ethereum !== "undefined") {
      const contractFactory = new ethers.ContractFactory(abi, binary, signer);
      console.log("Deploying ... please wait....");

      const contract = await contractFactory.deploy("150");
      await contract.deployTransaction.wait(1);
      console.log(`Contract deployed to ${contract.address}`);
      setIsDeployed(true);
      contractAddress = contract.address;
    } else {
      console.log("Please install MetaMask");
    }
  }

  async function name() {
    if (typeof window.ethereum !== "undefined") {
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        let nameContract = await contract.name();
        console.log(nameContract);
      } catch (e) {
        console.error(error);
      }
    }
  }

  async function mint() {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      let transaction = await contract.safeMint();
      await transaction.wait(1);
      nft = await contract.tokenURI(0);
      console.log(`Your NFT is : ${nft}`);
      setIsMint(true);
    } catch (e) {
      console.error(e);
    }
  }

  async function tokenUri() {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      let NFT = await contract.tokenURI(0);
      console.log(`Your NFT is : ${NFT}`);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      {hasMetamask ? (
        isConnected ? (
          "Connected!"
        ) : (
          <button onClick={() => connect()}>Connect!</button>
        )
      ) : (
        "Please install metamask!"
      )}

      {isConnected ? (
        <button onClick={() => deploy()}> Deploy Contract</button>
      ) : (
        " "
      )}
      {isConnected && isDeployed ? (
        <button onClick={() => name()}> Get Name</button>
      ) : (
        ""
      )}
      {isConnected && isDeployed ? (
        <button onClick={() => mint()}> Get you NFT</button>
      ) : (
        ""
      )}
      {isConnected && isDeployed && isMint ? (
        <button onClick={() => tokenUri()}> tokenURI</button>
      ) : (
        ""
      )}
    </div>
  );
}
