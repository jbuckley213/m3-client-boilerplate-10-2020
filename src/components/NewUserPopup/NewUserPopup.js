import React from "react";
import { withAuth } from "./../../context/auth-context";
import { PopUp, PopUpMenu } from "./../../styles/new-user-popup";
import ChatIcon from "@material-ui/icons/Chat";
import PersonIcon from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";
import HomeIcon from "@material-ui/icons/Home";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import Divider from "@material-ui/core/Divider";
import SwipeableViews from "react-swipeable-views";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const tutorialSteps = [
  {
    title: "Welcome to Social Developers",
    step: "Click on the home page to see posts from others who have followed",
    icon: <HomeIcon />,
  },
  {
    title: "Search",
    step: "Search to find other developers",
    icon: <SearchIcon />,
  },
  {
    title: "Your Profile",
    step: "Find your posts, likes and following on your profile page ",
    icon: <PersonIcon />,
  },
  {
    title: "Instant Messaging",
    step:
      "Instant Message other users and see who is online. To start a conversation search for the developer first",
    icon: <ChatIcon />,
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    height: 400,
    width: "90%",

    flexGrow: 1,
    border: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 70,
    paddingTop: 7,
    borderRadius: "10px 10px 0 0 ",
    background: "#57ba98",
    paddingLeft: theme.spacing(4),
    color: "white",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    // borderTop: "1px solid #3b945e",
    paddingTop: 20,
    height: 110,
    paddingLeft: theme.spacing(4),
  },
  buttons: {
    borderRadius: "0 0 10px 10px ",
    background: "#57ba98",
    color: "white",
  },
  btn: {
    color: "white",
  },
  "@media (min-width: 1024px)": {
    root: {
      width: "50%",
    },
  },
}));

function NewUserPopup(props) {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:1023px)");

  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <PopUp>
      <div className={classes.root}>
        <Paper square elevation={0} className={classes.header}>
          <Typography style={{ margin: "0 10px" }}>
            {tutorialSteps[activeStep].icon}
          </Typography>

          <Typography>{tutorialSteps[activeStep].title}</Typography>
          <CloseIcon onClick={props.closeNewUser} />
        </Paper>
        <Divider variant="middle" />
        {/* <Paper square elevation={0} className={classes.content}>
          <p>{tutorialSteps[activeStep].step}</p>
        </Paper> */}

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {tutorialSteps.map((step, index) => (
            <div key={step.label}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Paper square elevation={0} className={classes.content}>
                  <p>{tutorialSteps[activeStep].step}</p>
                </Paper>
              ) : null}
            </div>
          ))}
        </SwipeableViews>

        <MobileStepper
          steps={maxSteps}
          position="static"
          variant="text"
          className={classes.buttons}
          activeStep={activeStep}
          nextButton={
            <Button
              className={classes.btn}
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              className={classes.btn}
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </div>
    </PopUp>
  );
}

export default withAuth(NewUserPopup);
