import React from "react";
import GanttChart from "./GanttChart";
import { useFetchEvent } from "./useFetchEvent";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    loading: {
      textAlign: "center",
      marginTop: 300,
      fontSize: 30,
    },
  })
);

const Gantt: React.FC = () => {
  const [state] = useFetchEvent();
  const classes = useStyles();

  return (
    <>
      {state.loading ? (
        <div className={classes.loading}>Loading ...</div>
      ) : (
        <>
          <GanttChart />
        </>
      )}
    </>
  );
};

export default Gantt;
