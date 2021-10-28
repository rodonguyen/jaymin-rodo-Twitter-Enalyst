import React, { useContext } from "react";
import { Line, Chart } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import StreamingPlugin from "chartjs-plugin-streaming";
import { TweetContext } from "../../Context/TweetContext";

Chart.register(StreamingPlugin);

const Chartjs = () => {
  const { dataRef } =
    useContext(TweetContext);

  return (
    <div>
      <Line
        data={{
          datasets: [
            {
              label: "Score",
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgb(54, 162, 235)",
              cubicInterpolationMode: "monotone",
              // fill: true,
              data: dataRef.current,
            },
          ],
        }}
        options={{
          showLines: true,
          animation: false,
          scales: {
            x: {
              type: "realtime",
              realtime: {
                delay: 300,
              },
            },
            y: {
              type: "linear",
              min: -20,
              max: 20,
            },
          },
          plugins: {
            legend: {
              position: "right",
            },
            title: {
              display: true,
              text: "Realtime Sentiment Score Chart",
            },
          },
        }}
      />
    </div>
  );
};

export default Chartjs;
