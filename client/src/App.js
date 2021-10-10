import "./App.css";
import { CssBaseline, Grid, Paper } from "@material-ui/core";
import TweetProvider from "./Context/TweetContext";
import Header from "./Components/Header/Header";
import SearchBar from "./Components/SearchBar/SearchBar";
import Tweet from "./Components/Tweets";
function App() {
  return (
    <div>
      <TweetProvider>
        <CssBaseline />
        <Header />
        <Paper sx={{ p: 2, margin: "auto", width: "50px", flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item sm={20} xs={12}>
              <SearchBar />
            </Grid>
            <Tweet />
          </Grid>
        </Paper>
      </TweetProvider>
    </div>
  );
}

export default App;
