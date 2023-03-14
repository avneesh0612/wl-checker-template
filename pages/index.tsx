import {
  MediaRenderer,
  useClaimIneligibilityReasons,
  useContract,
  useContractMetadata,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const { contract, isLoading } = useContract(
    "0x6225ed3A90Fa9ecf7231B01c4da580A3B17D2a2f",
    "nft-drop"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { data: metadata } = useContractMetadata(contract);
  const { data: claimIneligibilityReasons, error } =
    useClaimIneligibilityReasons(contract, {
      walletAddress: "0x39Ab29fAfb5ad19e96CFB1E1c492083492DB89d4",
      quantity: 1,
    });

  const check = async () => {
    if (!walletAddress) {
      return setMessage("Please enter a wallet address!");
    }

    setLoading(true);

    try {
      const data = await contract?.erc721.claimConditions.getClaimerProofs(
        walletAddress
      );

      if (data) {
        setMessage(`You can claim ${data.maxClaimable} NFTs!`);
      } else {
        setMessage(
          claimIneligibilityReasons
            ? `You can't claim any NFTs because ${claimIneligibilityReasons[0]}`
            : "You can't claim any NFTs!"
        );
      }
    } catch (e) {
      setMessage(
        claimIneligibilityReasons
          ? `You can't claim any NFTs because ${claimIneligibilityReasons[0]}`
          : "You can't claim any NFTs!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h1>Whitelist checker!</h1>

        {metadata && (
          <div>
            <MediaRenderer
              src={metadata.image}
              alt={metadata.name}
              height="250px"
              width="250px"
            />
            <p>
              {metadata.name}
              {metadata.name && metadata.symbol && " - "}
              {metadata.symbol}
            </p>
            <p>{metadata.description}</p>
          </div>
        )}

        <input
          className={styles.input}
          type="text"
          placeholder="Enter your wallet address"
          value={walletAddress}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setWalletAddress(e.target.value)
          }
        />

        <button onClick={check} className={styles.mainButton}>
          {isLoading || loading ? "Loading..." : "Check if whitelisted"}
        </button>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Home;
