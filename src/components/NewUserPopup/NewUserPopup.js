import React from "react";
import { PopUp, PopUpMenu } from "./../../styles/new-user-popup";
import ChatIcon from "@material-ui/icons/Chat";
import PersonIcon from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";
import HomeIcon from "@material-ui/icons/Home";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

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
    width: 400,
    flexGrow: 1,
    height: 400,
    borderRadius: 50,
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 100,
    paddingLeft: theme.spacing(4),
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: theme.spacing(4),
  },
}));

function NewUserPopup() {
  const classes = useStyles();
  const theme = useTheme();

  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <PopUp>
      <div className={classes.root}>
        <Paper square elevation={0} className={classes.header}>
          <Typography>{tutorialSteps[activeStep].title}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content}>
          <p>{tutorialSteps[activeStep].step}</p>
          <p>{tutorialSteps[activeStep].icon}</p>
        </Paper>

        <MobileStepper
          steps={maxSteps}
          position="static"
          variant="text"
          activeStep={activeStep}
          nextButton={
            <Button
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

export default NewUserPopup;
//  <PopUp>
//       <PopUpMenu>
//         <h1>Welcome to Social Developers</h1>

//         <h3>How to use our App</h3>
//         <p>
//           Click on the home icon <HomeIcon /> to see posts from other Developers
//           who have followed
//         </p>
//       </PopUpMenu>
//     </PopUp>
