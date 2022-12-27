import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { GalleryElement } from "./GalleryElement";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: "auto",
      textAlign: "center",
    },
  })
);
export const Gallery = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GalleryElement />
    </div>
  );
};
