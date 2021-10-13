import React, { useState, useContext } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core/";
// @material-ui/icons
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

import styles from "./searchStyles";

const useStyles = makeStyles(styles);

const timer = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function SectionLogin() {
  const classes = useStyles();
  const [timerStream, getTimerStream] = useState([]);
  const { keyword, setKeyword, streamTime, setStreamTime } =
    useContext(TweetContext);
  const [input, setInput] = useState();

  const handleChange = (event) => {
    getTimerStream(event.target.value);
  };
  const inputSearch = () => {
    console.log(input);

    if (!input) {
      console.log("!input");
      return;
    } else if (!timerStream) {
      console.log(!timerStream);
      return;
    }
    setStreamTime({ timerStream });
    setKeyword({ input });
    console.log(keyword);
    console.log(streamTime);
  };
  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <GridContainer justifyContent="center">
          <GridItem xs={12} sm={12} md={4}>
            <Card>
              <form className={classes.form}>
                <CardHeader color="primary" className={classes.cardHeader}>
                  <h2>Welcome to the Application</h2>
                </CardHeader>
                <CardBody>
                  <CustomInput
                    labelText="search keyword..."
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
                  Select the duration of stream:
                </p>
                <FormControl fullWidth className={classes.selectTimer}>
                  <InputLabel id="timer-stream" className={classes.inputLabel}>
                    second
                  </InputLabel>
                  <Select
                    labelId="timer-stream"
                    id="timer-stream"
                    value={timerStream}
                    input={<OutlinedInput label="timer" />}
                    onChange={handleChange}
                  >
                    {timer.map((second) => (
                      <MenuItem
                        key={second}
                        value={second}
                        // style={getStyles(name, personName, theme)}
                      >
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
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
