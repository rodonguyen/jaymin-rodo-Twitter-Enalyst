import React, { useState, useContext } from "react";
// @material-ui/core components
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  makeStyles,
} from "@material-ui/core/";
// nodejs library that concatenates classes

import Search from "@material-ui/icons/Search";
// core components
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem.js";
import Card from "../Card/Card";
import CardHeader from "../Card/CardHeader.js";
import CardBody from "../Card/CardBody.js";
import CardFooter from "../Card/CardFooter.js";
import Button from "../CustomButtons/Button";
import CustomInput from "../CustomInput/CustomInput";
import { TweetContext } from "../../Context/TweetContext";
import TotalSearchChart from "../Chart/TotalSearchTweet";
import styles from "./searchStyles";
import GoogleTrends from "../TrendingKeyword/GoogleTrending";
import Notification from "../Notification/Notification";
const useStyles = makeStyles(styles);

const timer = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function SectionLogin() {
  const classes = useStyles();
  const [timerStream, getTimerStream] = useState();
  const [loaded, setLoaded] = useState(false);
  const { keyword, setKeyword, streamTime, setStreamTime, tweetAlert } =
    useContext(TweetContext);
  const [input, setInput] = useState();

  const handleChange = (event) => {
    getTimerStream(event.target.value);
  };
  const inputSearch = () => {
    if (!input) {
      alert("Missing keyword");
      return;
    }
    if (!timerStream) {
      alert("Missing timer for streaming");
      return;
    }
    const arr = input.trim().split(" ");
    if (arr.length !== 1) {
      alert("ony can search for one word")
      return;
    }
    setStreamTime({ timerStream });
    setKeyword({ input });
    setLoaded(true);
    console.log(keyword);
    console.log(streamTime);

  };
  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <GridContainer justifyContent="center">
          <GridItem xs={12} sm={12} md={4}>
            {loaded ? (
              <div>
                <div className={classes.noti}>
                  <Notification status={"success"} />
                </div>
                <Box sx={{ flexGrow: 1 }} className={classes.appbar}>
                  <AppBar position="static" className={classes.appbar}>
                    <Toolbar>
                      <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                      >
                        <MenuIcon />
                      </IconButton>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                      >
                        Go back to search bar
                      </Typography>
                      <Button
                        color="primary"
                        onClick={() => window.location.reload()}
                      >
                        <ReplayIcon />
                      </Button>
                    </Toolbar>
                  </AppBar>
                </Box>
                <Card>
                  <TotalSearchChart />
                </Card>
              </div>
            ) : (
              <div>
                <Card>
                  <form className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h2>Welcome to the Application</h2>
                    </CardHeader>
                    <CardBody>
                      <CustomInput
                        labelText="search one keyword..."
                        id="first"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: "text",
                          endAdornment: (
                            <InputAdornment position="end">
                              <Search className={classes.inputIconsColor} />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => setInput(e.target.value)}
                      />
                    </CardBody>
                    <p className={classes.divider}>
                      {" "}
                      Select the number of tweets:
                    </p>
                    <FormControl fullWidth className={classes.selectTimer}>
                      <InputLabel
                        id="timer-stream"
                        className={classes.inputLabel}
                      >
                        number
                      </InputLabel>
                      <Select
                        labelId="timer-stream"
                        id="timer-stream"
                        defaultValue={""}
                        value={timerStream}
                        input={<OutlinedInput label="timer" />}
                        onChange={handleChange}
                      >
                        {timer?.map((second) => (
                          <MenuItem key={second} value={second}>
                            {second}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <CardFooter className={classes.cardFooter}>
                      <Button
                        simple
                        color="primary"
                        size="lg"
                        onClick={inputSearch}
                      >
                        Search
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
                <h1>
                  <Card className={classes.trends}>
                    <GoogleTrends />
                  </Card>
                </h1>
              </div>
            )}
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
