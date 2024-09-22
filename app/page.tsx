"use client";

import { useState } from "react";

import AudioDeviceSelector from "./components/AudioDeviceSelector";
import Visualizer from "./components/Visualizer";

const Home: React.FC = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      {!selectedDeviceId ? (
        <AudioDeviceSelector setSelectedDeviceId={setSelectedDeviceId} />
      ) : (
        <Visualizer selectedDeviceId={selectedDeviceId} />
      )}
    </div>
  );
};

export default Home;
