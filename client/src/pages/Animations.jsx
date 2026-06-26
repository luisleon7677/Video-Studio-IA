import {useState,useEffect} from 'react';


export default function Animation () {

    const [videoUrl, setVideoUrl] = useState("");

    useEffect (()=>{
        setVideoUrl('https://universityibc.s3.us-east-1.amazonaws.com/dashboard/video_studio/plantillas_remotion/testventa.mp4');
        // setVideoUrl('http://localhost:3000/videos/testventa.mp4');
    },[]);

    return (
        <>
        <video
        src={videoUrl}
        controls
        width={600}>
        </video>
        </>
    );
}