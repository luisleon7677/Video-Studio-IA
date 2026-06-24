import {useState,useEffect} from 'react';


export default function Animation () {

    const [videoUrl, setVideoUrl] = useState("");

    useEffect (()=>{
        setVideoUrl('http://localhost:3000/videos/ecena.mp4');
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