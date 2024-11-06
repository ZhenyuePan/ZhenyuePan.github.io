"use client"
import "./globals.css";
import  React, { useEffect, useRef } from 'react';


export default function Home() {
  return (
  <main>
    <div className="startwaves" id="downout">
			<div className="waves">
				<img src="/waves/wave-1.svg" />
				<img src="/waves/wave-2.svg" />
				<img src="/waves/wave-3.svg" />
				<img src="/waves/wave-4.svg" />
				<img src="/waves/wave-5.svg" id="shape" />
			</div>
		</div>
		<div id="videobg">
			<video id="video2" className="videos" muted={true} loop>
				<img src="/assset/fv_movie2.mp4"/>
			</video>
			<video id="video1" className="videos" muted={true}>
				<img src="/assset/fv_movie1.mp4"/>
			</video>
			<div id="centertext">
				<h1>你好，我等待已久的人。</h1>
				<p className="small-text">欢迎来到我的个人网站。<br />很高兴和你分享我的故事。</p>
			</div>
			<img id="p3relogo" src="/P3RE.svg" alt="一张图片" />
		</div>

  </main>
  );
}
