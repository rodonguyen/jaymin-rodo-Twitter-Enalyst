import React, { useState, useContext } from "react";

import { Paper, InputBase, Box, Button } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import useStyles from "./styles.js";

import { TweetContext } from "../../Context/TweetContext";

const SearchBar = () => {
  const classes = useStyles();
  const { keyword, setKeyword } = useContext(TweetContext);
  const [input, setInput] = useState();
  const inputSearch = () => {
    console.log(input);

    if (!input) {
      console.log("!input");
      return;
    }

    setKeyword({ input });
    console.log(keyword);
  };
  return (
    <div className="search-section">
      <Box display="flex" className={classes.box}>
        <Paper className={classes.paper}>
          <div className={classes.search}>
            <InputBase
              placeholder="Search keyword..."
              classes={{ root: classes.inputRoot, input: classes.inputSearch }}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              variant="contained"
              className={classes.button}
              onClick={inputSearch}
            >
              <SearchIcon />
            </Button>
          </div>
        </Paper>
      </Box>
    </div>
  );
};

export default SearchBar;
