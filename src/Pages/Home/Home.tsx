import "../Home/src/home.css";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },

    loadMore: {
      position: "fixed",
      zIndex: 100,
      top: 200,
      right: 50,
    },
  })
);

const Home = () => {
  const classes = useStyles();
  const dd = String(new Date().getDate()).padStart(2, "0");
  const mm = String(new Date().getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = new Date().getFullYear();

  const today = yyyy + "." + mm + "." + dd;
  const [imageCnt, setImageCnt] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    delete require.cache[require.resolve("./src/js/main.js")];
    require("./src/js/main.js");
  }, [imageCnt]);

  return (
    <main className={classes.root}>
      <div className="l-contents js-contents">
        <div className="l-page l-page--white" data-id="gallery">
          <div className="p-website-outline">
            <h2 className="p-sketch-outline__title">Worthless Pixels</h2>
            <p className="p-sketch-outline__date">{today}</p>
            <input
              type="text"
              className="p-sketch-image_cnt"
              hidden
              id="image-cnt"
              value={imageCnt}
            ></input>
          </div>
          <Button
            className={classes.loadMore}
            disabled={isLoading}
            color="primary"
            onClick={() => {
              setImageCnt((imageCnt + 1) % 8);
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
              }, 4000);
            }}
            variant="contained"
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
          <canvas className="p-canvas-webgl" id="canvas-webgl" width="100%"></canvas>
        </div>
      </div>
      <div className="p-dummy-scroll js-dummy-scroll"></div>
    </main>
  );
};

export default Home;
