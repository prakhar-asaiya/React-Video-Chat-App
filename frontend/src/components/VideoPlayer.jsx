import React, { useContext, useState } from "react";
import { Grid, Typography, Paper, Button, Box } from "@material-ui/core";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import VideocamOffOutlinedIcon from "@material-ui/icons/VideocamOffOutlined";
import { makeStyles } from "@material-ui/core/styles";
import { SocketContext } from "../SocketContext";
import { MicOff } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  video: {
    width: "550px",
    [theme.breakpoints.down("xs")]: {
      width: "300px",
    },
    transform: "rotateY(180deg)",
  },
  gridContainer: {
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  paper: {
    padding: "10px",
    border: "2px solid black",
    margin: "10px",
  },
}));

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
    useContext(SocketContext);
  const classes = useStyles();

  const [mutedAudio, setMutedAudio] = useState(true);
  const [playingVideo, setPlayingVideo] = useState(true);

  const startVideo = () => {
    setPlayingVideo(true);
    navigator.getUserMedia(
      { video: true },
      (stream) => {
        myVideo.current.srcObject = stream;
      },
      (err) => console.log(err)
    );
  };

  const stopVideo = () => {
    setPlayingVideo(false);
    myVideo.current.srcObject.getVideoTracks()[0].stop();
  };

  return (
    <Grid container className={classes.gridContainer}>
      {stream && (
        /******************           Our own video           ************************/
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {name || "Name"}
            </Typography>
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className={classes.video}
              id="ourVideo"
            />
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<MicOff fontSize="large" />}
            >
              Turn Off Audio
            </Button>
            {playingVideo ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<VideocamOffOutlinedIcon fontSize="large" />}
                onClick={stopVideo}
              >
                Turn Off Video
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<VideocamOutlinedIcon fontSize="large" />}
                onClick={startVideo}
              >
                Turn On Video
              </Button>
            )}
          </Box>
        </Paper>
      )}
      {callAccepted && !callEnded && (
        /*******************          User's video           ************************/
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {call.name || "Name"}
            </Typography>
            <video
              id="videogrid"
              playsInline
              ref={userVideo}
              autoPlay
              className={classes.video}
            />
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};

export default VideoPlayer;
