import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FAQ_Data } from "../Utils/constants";
import { useMediaQuery } from 'react-responsive'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginTop: 100,
    },
    heading: {
      fontSize: 70,
      fontWeight: theme.typography.fontWeightRegular,
      marginBottom: 20,
      fontFamily: "Montserrat",
    },
    headingTablet: {
      fontSize: 30,
      fontWeight: theme.typography.fontWeightRegular,
      marginBottom: 20,
      fontFamily: "Montserrat",
    },
    title: {
      textTransform: "uppercase",
      fontFamily: "Montserrat",
    },
    descriptionItem: {},
    description: {
      fontWeight: 200,
      fontFamily: "Montserrat",
    },
    item: {
      marginBottom: 5,
      fontSize: 20
    },
    itemTablet: {
      marginBottom: 5,
      fontSize: 14
    }
  })
);

export const FAQ = () => {
  const classes = useStyles();
  
  const isTablet = useMediaQuery({ query: '(max-width: 600px)' })

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      className={classes.root}
    >
      <Grid item xs={10}>
        <Typography className={isTablet? classes.headingTablet : classes.heading}>
          Frequently Asked Questions
        </Typography>
      </Grid>
      <Grid item xs={10}>
        {FAQ_Data.map((item, index) => (
          <Accordion className={isTablet? classes.itemTablet : classes.item} key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id={`panel1a-header${index}`}
            >
              <Typography className={classes.title}>{item.title}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.descriptionItem}>
              <Typography className={classes.description}>
                {item.description}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>
    </Grid>
  );
};
