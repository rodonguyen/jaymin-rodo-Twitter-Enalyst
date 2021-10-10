import React, { useState, useContext } from "react";

import { InputBase, Box, Button } from "@material-ui/core";
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
    <Box display="flex">
      <div className={classes.search}>
        <div className={classes.searchIcon}></div>
        <InputBase
          placeholder="Search keyword..."
          classes={{ root: classes.inputRoot, input: classes.inputSearch }}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button variant="contained" onClick={inputSearch}>
          <SearchIcon />
        </Button>
      </div>
    </Box>
  );
};

export default SearchBar;
