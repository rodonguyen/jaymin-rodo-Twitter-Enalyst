import "./App.css";
import { CssBaseline } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import GridContainer from "./Components/Grid/GridContainer.js";
import GridItem from "./Components/Grid/GridItem.js";
import TweetProvider from "./Context/TweetContext";
import Header from "./Components/Header/Header";
import SearchBar from "./Components/SearchBar/SearchBar";
import Tweet from "./Components/Tweets";
import Parallax from "./Components/Parallax/Parallax";
import styles from "./assets/jss/material-kit-react/homepage.js";
import SearchSection from "./Components/SearchBar/SearchSection";
const useStyles = makeStyles(styles);

function App(props) {
  const classes = useStyles();
  const { ...rest } = props;
  return (
    <div>
      <TweetProvider>
        <CssBaseline />
        <Header
          brand="Twitter Sentiment"
          // rightLinks={}
          fixed
          color="transparent"
          changeColorOnScroll={{
            height: 400,
            color: "white",
          }}
          {...rest}
        />
        <Parallax image="https://monkeylearn.com/static/6700dcab9bcc691104dd0d794f6e7ef4/Sentiment-analysis-of-Twitter-Social.png">
          <div className={classes.container}>
            <GridContainer></GridContainer>
          </div>
        </Parallax>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <SearchSection />
        </div>
        <Tweet />
      </TweetProvider>
    </div>
  );
}

export default App;
