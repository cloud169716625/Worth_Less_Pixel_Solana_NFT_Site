import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import styled from "styled-components";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import { WalletDisconnectButton } from "@solana/wallet-adapter-material-ui";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { shortenAddress } from "../candy-machine";
import { Link } from "react-router-dom";
import Logo from "../Components/Assets/Logo.png";
import Grid from "@material-ui/core/Grid";
import Drawer from "@material-ui/core/Drawer";
import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import { useMediaQuery } from "react-responsive";
import ReorderIcon from "@material-ui/icons/Reorder";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      cursor: "pointer",
      marginRight: 30,
      textDecoration: "none",
      color: "white",
      "&:hover": {
        cursor: "pointer",
      },
    },
    titleBack: {
      "&:hover": {
        backgroundColor: "#5971fb",
      },
    },
    connectBtn: {
      marginRight: theme.spacing(2),
      display: "flex",
      justifyContent: "end",
    },
    walletAddress: {
      color: "white",
      fontSize: 15,
      "&:hover": {
        cursor: "pointer",
      },
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    menuItems: {
      backgroundColor: "#3f51b5",
      paddingLeft: 20,
    },
    menuItemsTablet: {
      backgroundColor: "#3f51b5",
      textAlign: "center",
    },
    menu: {
      display: "flex",
      alignItems: "center",
      padding: 10,
      paddingLeft: 30,
    },
    drawer: {
      flexShrink: 0,
      width: 280,
    },
    drawerPaper: {
      width: 280,
      backgroundColor: "#3f51b5",
      textAlign: "left",
      lineHeight: 3,
    },
    menuResTitle: {
      color: theme.palette.error.light,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      maxHeight: 100,
      backgroundColor: "#3f51b5",
      borderBottom: "1px solid white",
    },
    toggleIcon: {
      cursor: "pointer",
      paddingLeft: 10,
    },
    logoSection: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#3f51b5",
      width: "100%",
    },
    logoSectionSidebar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "left",
      padding: "10px 20px 20px 10px",
    },
    tabletLogo: {
      padding: 10,
    },
    closeBtn: {
      color: "white",
      padding: 10,
    },
    tabletMenuClass: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 5,
    },
  })
);

const ConnectButton = styled(WalletDialogButton)``;
const DisconnectButton = styled(WalletDisconnectButton)``;

const MintContainer = styled.div``; // add your styles here

export const Header = () => {
  const classes = useStyles();
  const wallet = useAnchorWallet();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleDrawer = (event: any) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setMenuOpen(!menuOpen);
  };

  const isTablet = useMediaQuery({ query: "(max-width: 1000px)" });

  let generalMenu = (
    <AppBar position="static">
      <Grid className={classes.header}>
        <Grid className={classes.menu}>
          <img src={Logo} alt="logo" />
          <Grid className={classes.menuItems}>
            <Link to="/" className={classes.title}>
              HOME
            </Link>
            <Link to="/minted" className={classes.title}>
              MINT
            </Link>
            <Link to="/gallery" className={classes.title}>
              GALLERY
            </Link>
            <Link to="/provenance" className={classes.title}>
              PROVENANCE
            </Link>
            <Link to="/roadmap" className={classes.title}>
              ROADMAP
            </Link>
            <Link to="/faq" className={classes.title}>
              FAQ
            </Link>
            <Link to="/coming" className={classes.title}>
              CONTACT
            </Link>
          </Grid>
        </Grid>
        <Grid className={classes.connectBtn}>
          <MintContainer>
            {!wallet ? (
              <ConnectButton>Connect Wallet</ConnectButton>
            ) : (
              <Grid className={classes.walletAddress}>
                <DisconnectButton>
                  {shortenAddress(wallet.publicKey.toBase58() || "")}
                </DisconnectButton>
              </Grid>
            )}
          </MintContainer>
        </Grid>
      </Grid>
    </AppBar>
  );

  let tabletMenu = (
    <AppBar position="static">
      <Drawer
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
        open={menuOpen}
        onClose={toggleDrawer}
      >
        <Grid item xs={12} className={classes.menuResTitle}>
          <img src={Logo} alt="logo" className={classes.tabletLogo} />
          <CloseIcon
            onClick={toggleDrawer}
            style={{ cursor: "pointer" }}
            className={classes.closeBtn}
          />
        </Grid>
        <Grid>
          <Grid>
            <Grid className={classes.menuItemsTablet}>
              <Grid className={classes.titleBack}>
                <Link to="/" className={classes.title}>
                  HOME
                </Link>
              </Grid>
              <Grid className={classes.titleBack}>
                <Link to="/mint" className={classes.title}>
                  MINT
                </Link>
              </Grid>
              <Grid className={classes.titleBack}>
                <Link to="/gallery" className={classes.title}>
                  GALLERY
                </Link>
              </Grid>
              <Grid className={classes.titleBack}>
                <Link to="/provenance" className={classes.title}>
                  PROVENANCE
                </Link>
              </Grid>
              <Grid className={classes.titleBack}>
                <Link to="/roadmap" className={classes.title}>
                  ROADMAP
                </Link>
              </Grid>
              <Grid className={classes.titleBack}>
                <Link to="/faq" className={classes.title}>
                  FAQ
                </Link>
              </Grid>
              <Grid className={classes.titleBack}>
                <Link to="/coming" className={classes.title}>
                  CONTACT
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
    </AppBar>
  );

  let simpleMenu = (
    <AppBar>
      <Grid className={classes.tabletMenuClass}>
        <ReorderIcon
          fontSize="large"
          onClick={toggleDrawer}
          className={classes.toggleIcon}
        />
        <Grid className={classes.connectBtn}>
          <MintContainer>
            {!wallet ? (
              <ConnectButton>Connect Wallet</ConnectButton>
            ) : (
              <Grid className={classes.walletAddress}>
                <DisconnectButton>
                  {shortenAddress(wallet.publicKey.toBase58() || "")}
                </DisconnectButton>
              </Grid>
            )}
          </MintContainer>
        </Grid>
      </Grid>
    </AppBar>
  );

  return (
    <div className={classes.root}>
      <Grid item xs={2} md={2} className={classes.logoSection}>
        {isTablet ? simpleMenu : ""}
      </Grid>
      {isTablet ? tabletMenu : generalMenu}
    </div>
  );
};
