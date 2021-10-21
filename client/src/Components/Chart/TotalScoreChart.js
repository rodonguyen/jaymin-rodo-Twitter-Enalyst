import React, { useContext, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { TweetContext } from "../../Context/TweetContext";

const options = {
  legend: {
    display: false,
  },
  indexAxis: "y",
  // Elements options apply to all of the options unless overridden in a dataset
  // In this case, we are setting the border of each horizontal bar to be 2px wide
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    labels: {
      display: "false",
    },
    title: {
      display: true,
      text: "Summary Sentiment Score Chart",
    },
  },
};
const TotalScoreChart = () => {
  const { scoreTweet } = useContext(TweetContext);
  const [negativeScore, setNegativeScore] = useState(null);
  const [positiveScore, setPositiveScore] = useState(null);

  useEffect(() => {
    scoreTweet.forEach((x) => {
      if (x >= 0) {
      } else {
      }
    });
  }, [scoreTweet]);
  const averageScore = (positiveScore + negativeScore) / 2;
  const sumScore = positiveScore + negativeScore;
  const data = [negativeScore, positiveScore, sumScore, averageScore];
  console.log(data);
  return (
    <div>
      <Bar
        data={{
          labels: ["Negative", "Positive", "Sum", "Average"],
          datasets: [
            {
              data: data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        }}
        options={options}
      />
    </div>
  );
};

export default TotalScoreChart;
