const redis = require("redis");
require("dotenv").config();

// This section will change for Cloud Services
const redisClient = redis.createClient();
redisClient.on("error", (err) => {
  console.log("Error " + err);
});

var write = () => {
    redisClient.setex(
        'TwitterEnalyst:low',
        3600,
        JSON.stringify({ keywords: "lala me damn it", summary: "Dear god" })
    )
        console.log("Successfully uploaded data to Redis");
}

var read = () => { 
    redisClient.get('TwitterEnalyst:raw', (err, data) => {
        if (data) {
          const resultJSON = JSON.parse(data);
          console.log("Persistence ---------> Found in Redis");
          console.log(resultJSON);
          
          // set Score on Chart 3 to 'summary' score
          // TODO
        }
        else {
            console.log("Nope can't find", data);
        }
    });

}

write()
read()