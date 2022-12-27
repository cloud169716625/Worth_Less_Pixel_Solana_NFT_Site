import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Gantt from "./Gantt";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: "auto",
      textAlign: "center",
    },
    message: {
      marginTop: 300,
    },
  })
);
export const RoadMap = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Gantt />
    </div>
  );
};
