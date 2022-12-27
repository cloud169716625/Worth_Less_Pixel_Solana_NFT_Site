import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

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
export const Coming = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h1" className={classes.message}>
        COMING SOON
      </Typography>
    </div>
  );
};
