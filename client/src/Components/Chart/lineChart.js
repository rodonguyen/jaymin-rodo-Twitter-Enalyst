import React, { useContext } from "react";
import { Line, Chart } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import StreamingPlugin from "chartjs-plugin-streaming";
import { TweetContext } from "../../Context/TweetContext";

Chart.register(StreamingPlugin);

const Chartjs = () => {
  const { keyword, streamTime, sentimentScore, timeStamp, dataRef } =
    useContext(TweetContext);

  return (
    <div>
      <Line
        data={{
          datasets: [
            {
              label: "score",
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgb(54, 162, 235)",
              cubicInterpolationMode: "monotone",
              fill: true,
              data: dataRef.current,
            },
          ],
        }}
        options={{
          scales: {
            x: {
              type: "realtime",
              realtime: {
                delay: 7000,
              },
            },
            y: {
              type: "linear",
              min: -10,
              max: 10,
            },
          },
        }}
      />
    </div>
  );
};

export default Chartjs;
