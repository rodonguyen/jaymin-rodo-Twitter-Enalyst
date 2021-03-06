import {
  primaryColor,
  warningColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
} from "../../assets/jss/material-kit-react.js";

const badgeStyle = {
  badge: {
    marginRight: "3px",
    borderRadius: "12px",
    padding: "5px 12px",
    marginTop: "5px",
    marginLeft: "5px",
    textTransform: "uppercase",
    fontSize: "15px",
    fontWeight: "500",
    lineHeight: "1",
    color: "#fff",
    textAlign: "center",
    whiteSpace: "nowrap",
    verticalAlign: "baseline",
    display: "inline-block",
  },
  primary: {
    backgroundColor: primaryColor,
  },
  warning: {
    backgroundColor: warningColor,
  },
  danger: {
    backgroundColor: dangerColor,
  },
  success: {
    backgroundColor: successColor,
  },
  info: {
    backgroundColor: infoColor,
  },
  rose: {
    backgroundColor: roseColor,
  },
  gray: {
    backgroundColor: "#6c757d",
  },
};

export default badgeStyle;
