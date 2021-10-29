import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Check from "@material-ui/icons/Check";
import Warning from "@material-ui/icons/Warning";
// core components
import SnackbarContent from "../Snackbar/SnackbarContent.js";

import styles from "./notificationStyles.js";
import { alertClasses } from "@mui/material";

const useStyles = makeStyles(styles);

export default function SectionNotifications({ status }) {
  const notiStatus = (status) => {
    switch (status) {
      case "success":
        return (
          <SnackbarContent
            message={
              <span>
                <b>SUCCESS ALERT:</b> Search successful, getting data from the API
              </span>
            }
            close
            color="success"
            icon={Check}
          />
        );
      case "warning":
        return (
          <SnackbarContent
            message={
              <span>
                <b>WARNING ALERT:</b> You{"'"}ve got some friends nearby, stop
                looking at your phone and find them...
              </span>
            }
            close
            color="warning"
            icon={Warning}
          />
        )
      case "error":
        return (
          <SnackbarContent
            message={
              <span>
                <b>DANGER ALERT:</b> You{"'"}ve got some friends nearby, stop
                looking at your phone and find them...
              </span>
            }
            close
            color="danger"
            icon="info_outline"
          />
        )
      case "info":
        return (
          <SnackbarContent
            message={
              <span>
                <b>INFO ALERT:</b> You{"'"}ve got some friends nearby, stop looking
                at your phone and find them...
              </span>
            }
            close
            color="info"
            icon="info_outline"
          />
        )
    }
  }
  const classes = useStyles();
  return (
    <div className={classes.section} id="notifications">
      <div className={classes.container}> </div>
      {
        notiStatus(status)
      }
    </div>
  );
}
