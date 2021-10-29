import React, { useContext } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Check from "@material-ui/icons/Check";
import Warning from "@material-ui/icons/Warning";
// core components
import SnackbarContent from "../Snackbar/SnackbarContent.js";
import { TweetContext } from "../../Context/TweetContext";

import styles from "./notificationStyles.js";

const useStyles = makeStyles(styles);

export default function SectionNotifications({ status, counts, display, setDisplay }) {
  const notiStatus = (status, counts) => {
    switch (status) {
      case "success":
        return (
          <SnackbarContent
            message={
              <span>
                <b>SUCCESS ALERT:</b> Search successful, {counts} available tweets
              </span>
            }
            close
            color="success"
            icon={Check}
            setDisplay={setDisplay}
          />
        );
      case "error":
        return (
          <SnackbarContent
            message={
              <span>
                <b>ERROR ALERT:</b> Can not get tweets, please check your keyword and try again
              </span>
            }
            close
            color="danger"
            icon={Warning}
            setDisplay={setDisplay}
          />
        )

    }
  }
  const classes = useStyles();
  return (
    <div className={classes.section} id="notifications">
      {display ? <div className={classes.container}>{notiStatus(status, counts)} </div>

        : null}
    </div>
  );
}
