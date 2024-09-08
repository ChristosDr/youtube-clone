import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

app.post("/process-video", (req, res) =>{
    //Get path of the input video file from the request body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath || !outputFilePath){
        res.status(400).send("Bad Request: Missinf file path.")
    }

    //Converting the video to 360p
    ffmpeg(inputFilePath)
        .outputOption("-vf", "scale=-1:360")
        .on("end", () => {//when the processing is completed
            return res.status(200).send("Video processing finished successfully..")
        })
        .on("error", (err) => {//if we have an error
            console.log(`An error occured: ${err.message}`);
            res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(outputFilePath);

    
});

const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`Video Processing service listening ar http://localhost:${port}`);
});