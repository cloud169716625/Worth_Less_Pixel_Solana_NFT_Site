import { useEffect, useState } from "react";
import styled from "styled-components";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as anchor from "@project-serum/anchor";
import Grid from "@material-ui/core/Grid";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { GatewayProvider } from "@civic/solana-gateway-react";
import { MintButton } from "../MintButton";
import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
  CANDY_MACHINE_PROGRAM,
} from "../candy-machine";
import { AlertState, getAtaForMint } from "../utils";
import { useMediaQuery } from 'react-responsive'

const MintContainer = styled.div``; // add your styles here

export interface MintProps {
  candyMachineId: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  txTimeout: number;
  rpcHost: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    content: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: 100,
      fontSize: 20,
    },
    contentTablet: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: '100px 20px',
      fontSize: 20,
    },
    info: {
      boxShadow: "0px 0px 5px 5px #4c4c4c",
      padding: 50,
      textAlign: "center",
    },
    infoTablet: {
      boxShadow: "0px 0px 5px 5px #4c4c4c",
      padding: '50px 5px',
      textAlign: "center",
    },
    button: {
      display: "flex",
      justifyContent: "center",
    },
  })
);

const Mint = (props: MintProps) => {
  const classes = useStyles();

  const isTablet = useMediaQuery({ query: '(max-width: 600px)' })

  const [balance, setBalance] = useState<number>();
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  const [whitelistTokenBalance, setWhitelistTokenBalance] = useState(0);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const rpcUrl = props.rpcHost;

  const refreshCandyMachineState = () => {
    (async () => {
      console.log("refresh cm");
      if (!wallet) return;

      try {
        const cndy = await getCandyMachineState(
          wallet as anchor.Wallet,
          props.candyMachineId,
          props.connection
        );

        setCandyMachine(cndy);

        setItemsAvailable(cndy.state.itemsAvailable);
        setItemsRemaining(cndy.state.itemsRemaining);
        setItemsRedeemed(cndy.state.itemsRedeemed);

        // fetch whitelist token balance
        if (cndy.state.whitelistMintSettings) {
          setWhitelistEnabled(true);
          let balance = 0;
          try {
            const tokenBalance = await props.connection.getTokenAccountBalance(
              (
                await getAtaForMint(
                  cndy.state.whitelistMintSettings.mint,
                  wallet.publicKey
                )
              )[0]
            );

            balance = tokenBalance?.value?.uiAmount || 0;
          } catch (e) {
            console.error(e);
            balance = 0;
          }

          setWhitelistTokenBalance(balance);
        } else {
          setWhitelistEnabled(false);
        }
      } catch {
        // setAlertState({
        //   open: true,
        //   message: "Please check connected network on your phantom wallet",
        //   severity: "error",
        // });
      }
    })();
  };

  const onMint = async () => {
    try {
      console.log("Miniting now");
      setIsMinting(true);
      document.getElementById("#identity")?.click();
      if (wallet && candyMachine?.program && wallet.publicKey) {
        const mintTxId = (
          await mintOneToken(candyMachine, wallet.publicKey)
        )[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            "singleGossip",
            true
          );
        }

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (!error.message) {
          message = "Transaction Timeout! Please try again.";
        } else if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      if (wallet) {
        try {
          const balance = await props.connection.getBalance(wallet.publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch {
          // setAlertState({
          //   open: true,
          //   message: "Please check connected network on your phantom wallet",
          //   severity: "error",
          // });
        }
      }
      setIsMinting(false);
      refreshCandyMachineState();
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        try {
          const balance = await props.connection.getBalance(wallet.publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch {
          // setAlertState({
          //   open: true,
          //   message: "Please check connected network on your phantom wallet",
          //   severity: "error",
          // });
        }
      }
    })();
  }, [wallet, props.connection]);

  useEffect(refreshCandyMachineState, [
    wallet,
    props.candyMachineId,
    props.connection,
  ]);

  return (
    <main className={classes.root}>
      <Grid className={isTablet? classes.contentTablet : classes.content}>
        <Grid className={wallet && isTablet? classes.infoTablet : classes.info}>
          <Grid>
            {wallet && (
              <Grid>
                <p>
                  Wallet Address:{" "}
                  {shortenAddress(wallet.publicKey.toBase58() || "")}
                </p>
                <p>Balance: {(balance || 0).toLocaleString()} SOL</p>
                <p>Total Available: {itemsAvailable}</p>
                <p>Redeemed: {itemsRedeemed}</p>
                <p>Remaining: {itemsRemaining}</p>
              </Grid>
            )}
          </Grid>
          <Grid>
            {wallet && whitelistEnabled && (
              <p>Whitelist token balance: {whitelistTokenBalance}</p>
            )}
          </Grid>
          <Grid className={classes.button}>
            {
              <MintContainer>
                {!wallet ? (
                  <>You should connect your wallet!</>
                ) : candyMachine?.state.gatekeeper &&
                  wallet.publicKey &&
                  wallet.signTransaction ? (
                  <GatewayProvider
                    wallet={{
                      publicKey:
                        wallet.publicKey ||
                        new PublicKey(CANDY_MACHINE_PROGRAM),
                      //@ts-ignore
                      signTransaction: wallet.signTransaction,
                    }}
                    // // Replace with following when added
                    // gatekeeperNetwork={candyMachine.state.gatekeeper_network}
                    gatekeeperNetwork={
                      candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                    } // This is the ignite (captcha) network
                    /// Don't need this for mainnet
                    clusterUrl={rpcUrl}
                    options={{ autoShowModal: false }}
                  >
                    <MintButton
                      candyMachine={candyMachine}
                      isMinting={isMinting}
                      onMint={onMint}
                    />
                  </GatewayProvider>
                ) : (
                  <MintButton
                    candyMachine={candyMachine}
                    isMinting={isMinting}
                    onMint={onMint}
                  />
                )}
              </MintContainer>
            }
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default Mint;
