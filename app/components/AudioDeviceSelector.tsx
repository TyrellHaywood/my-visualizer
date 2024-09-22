"use client";

import React, { useState, useEffect } from "react";

interface AudioDeviceSelectorProps {
  setSelectedDeviceId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AudioDeviceSelector: React.FC<AudioDeviceSelectorProps> = ({
  setSelectedDeviceId,
}) => {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceIdState] = useState<string | null>(
    null
  );

  useEffect(() => {
    // function to fetch audio input devices
    const getAudioDevices = async () => {
      // get all media devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      // filter out only audio input devices
      const audioInputDevices = devices.filter(
        (device) => device.kind === "audioinput"
      );
      // update state with audio input devices
      setAudioDevices(audioInputDevices);
    };

    // call the function to fetch audio devices
    getAudioDevices();
  }, []);

  // handle change event for the select element
  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // get the selected device ID
    const deviceId = e.target.value;
    // update local state with selected device ID
    setSelectedDeviceIdState(deviceId);
    // update parent component state with selected device ID
    setSelectedDeviceId(deviceId);
  };

  return (
    <div className="flex flex-col items-center">
      <label htmlFor="audioDevice">Select Audio Input:</label>
      <select
        id="audioDevice"
        onChange={handleDeviceChange}
        className="p-2 bg-gray-700 text-white rounded"
      >
        <option value="">Select Device</option>
        {audioDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Device ${device.deviceId}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AudioDeviceSelector;
