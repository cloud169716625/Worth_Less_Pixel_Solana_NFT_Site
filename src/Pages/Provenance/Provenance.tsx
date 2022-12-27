import "../Provenance/src/provenance.css";
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import BubbleChart from "./BubbleChart.js";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { useMediaQuery } from "react-responsive";

const _ = require("lodash");

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },

    selectBox: {
      textAlign: "center",
    },
    title: {
      textAlign: "center",
      fontSize: 50,
      marginTop: 60,
    },
    loading: {
      textAlign: "center",
      marginTop: 300,
      fontSize: 30,
    },
    loadMore: {
      marginLeft: 30,
    },
  })
);

const PrettoSlider = withStyles({
  root: {
    color: "#52af77",
    height: 8,
    width: 150,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const Provenance = () => {
  const classes = useStyles();
  const [tokenList, setList] = useState([]);
  const [collection, setCollection] = useState("solana_monkey_business");
  const [rawdata, setRawData] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [zoomRatio, setZoomRatio] = useState(1);
  const getTokenList = async (collection: any) => {
    const skip = pageNum * 20;
    const limit = skip + 20;
    const CORS_PROXY_API = `https://cors.worthlesspixels.workers.dev/?u=`;
    const baseURL = `https://api-mainnet.magiceden.io/rpc/getListedNFTsByQuery?q={"$match":{"collectionSymbol":"${collection}"},"$sort":{"createdAt":-1},"$skip":${skip},"$limit":${limit}}`;

    var res = await axios.get(`${CORS_PROXY_API}${baseURL}`);
    setTimeout(() => {
      setList(res.data["results"]);
    }, 2000);
  };

  useEffect(() => {
    getTokenList(collection);
    // eslint-disable-next-line
  }, [collection]);

  useEffect(() => {
    getTokenList(collection);
    // eslint-disable-next-line
  }, [pageNum]);

  useEffect(() => {
    let rawdata1 = _.map(_.range(tokenList.length), () => {
      return {
        v: _.random(0, tokenList.length - 1),
      };
    });
    setRawData(rawdata1);
  }, [tokenList]);

  const handleChange = (e: any) => {
    setCollection(e.target.value);
    setPageNum(0);
  };

  const isTablet = useMediaQuery({ query: "(max-width: 1000px)" });

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.title}>
        Worthless Bubbles v1.0
      </Grid>
      <Grid item xs={6} md={4} className={classes.selectBox}>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={collection}
          onChange={handleChange}
        >
          <MenuItem value="solana_monkey_business">
            Solana Monkey Business
          </MenuItem>
          <MenuItem value="taiyo_robotics">Taiyo_Robotics</MenuItem>
          <MenuItem value="thugbirdz">Thugbirdz</MenuItem>
          <MenuItem value="zillaz_nft">Zillz NFT</MenuItem>
          <MenuItem value="boryoku_dragonz">Boryoku Dragonz</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={6} md={4} className={classes.selectBox}>
        <Button
          className={classes.loadMore}
          color="primary"
          disabled={pageNum === 0}
          onClick={() => {
            setPageNum(pageNum - 1);
          }}
          variant="contained"
        >
          Prev
        </Button>
        <Button
          className={classes.loadMore}
          disabled={tokenList.length === 0 && pageNum !== 0}
          color="primary"
          onClick={() => {
            setPageNum(pageNum + 1);
          }}
          variant="contained"
        >
          Next
        </Button>
      </Grid>
      <Grid item xs={12} md={4} className={classes.selectBox}>
        <Typography gutterBottom>Zoom In / Out</Typography>
        <PrettoSlider
          valueLabelDisplay="auto"
          aria-label="pretto slider"
          defaultValue={100}
          min={1}
          onChange={(e, value) => {
            setZoomRatio(parseInt(value.toString()) / 100);
          }}
        />
      </Grid>

      {tokenList.length !== 0 && tokenList.length === rawdata.length ? (
        <BubbleChart
          useLabels={true}
          data={rawdata}
          width={window.innerWidth}
          height={window.innerHeight}
          tokenList={tokenList}
          zoomRatio={zoomRatio}
          isTablet={isTablet}
        />
      ) : pageNum === 0 ? (
        <Grid item xs={12} className={classes.loading}>
          Loading....
        </Grid>
      ) : (
        <Grid item xs={12} className={classes.loading}>
          No More Data
        </Grid>
      )}
    </Grid>
  );
};

export default Provenance;
