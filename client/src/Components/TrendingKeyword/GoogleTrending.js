import React, { useContext } from "react";
import NavPills from "../NavPil/NavPil";
import GoogleIcon from "@mui/icons-material/Google";
import LanguageIcon from "@mui/icons-material/Language";
import { TweetContext } from "../../Context/TweetContext";
import Badge from "../Badge/Badge";
const GoogleTrends = () => {
  const { googleTrends } = useContext(TweetContext);
  const color = ["primary", "warning", "danger", "success", "info", "rose"];
  return (
    <NavPills
      color="warning"
      horizontal={{
        tabsGrid: { xs: 12, sm: 4, md: 4 },
        contentGrid: { xs: 12, sm: 8, md: 8 },
      }}
      tabs={[
        {
          tabButton: "Google Trend Keyword",
          tabIcon: GoogleIcon,
          tabContent: (
            <span>
              {googleTrends?.map((keyword, i) => {
                return (
                  <Badge
                    color={color[Math.floor(Math.random() * color.length)]}
                    key={i}
                  >
                    {keyword.keyword}
                  </Badge>
                );
              })}
            </span>
          ),
        },
        {
          tabButton: "Website Trend Keyword",
          tabIcon: LanguageIcon,
          tabContent: (
            <span>
              <p>404 Not Foud :D</p>
            </span>
          ),
        },
      ]}
    />
  );
};

export default GoogleTrends;
