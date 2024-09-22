"use client";

import React, { useEffect, useRef } from "react";

interface VisualizerProps {
  selectedDeviceId: string | null;
}

const Visualizer: React.FC<VisualizerProps> = ({ selectedDeviceId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!selectedDeviceId) return; // return if no device is selected

    const setupAudio = async () => {
      try {
        // get audio stream from the selected device
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: selectedDeviceId
              ? { exact: selectedDeviceId }
              : undefined,
          },
        });

        // create audio context and analyser
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        // configure analyser
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // get canvas context
        const canvas = canvasRef.current!;
        const canvasCtx = canvas.getContext("2d")!;
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        // function to draw the visualizer
        const drawVisualizer = () => {
          requestAnimationFrame(drawVisualizer);

          // get frequency data
          analyser.getByteFrequencyData(dataArray);
          canvasCtx.fillStyle = "rgb(0, 0, 0)";
          canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

          // draw bars
          const barWidth = (canvas.width / bufferLength) * 2.5;
          let barHeight: number;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            const r = barHeight + 100;
            const g = i * 4;
            const b = 255 - barHeight;
            canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
            canvasCtx.fillRect(
              x,
              canvas.height - barHeight,
              barWidth,
              barHeight
            );
            x += barWidth + 1;
          }
        };

        drawVisualizer();
      } catch (err) {
        console.error("Error accessing audio stream:", err);
      }
    };

    setupAudio();
  }, [selectedDeviceId]); // re-run whenever selectedDeviceId changes

  return (
    <div className="flex justify-center items-center">
      <canvas
        ref={canvasRef}
        className="border"
        width={800}
        height={400}
      ></canvas>
    </div>
  );
};

export default Visualizer;
