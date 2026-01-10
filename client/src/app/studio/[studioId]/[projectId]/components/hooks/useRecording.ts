'use client';

import { useRef, useCallback, useEffect } from 'react';
import { Recording } from '../../types';

export const useRecording = (
  isRecording: boolean,
  setIsRecording: (recording: boolean) => void,
  setRecordingTime: (time: number) => void,
  addSystemMessage: (message: string) => void,
  setRecordings: React.Dispatch<React.SetStateAction<Recording[]>>,
  recordings: Recording[],
  recordingTime: number
) => {
  const recordingIntervalRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    startTimeRef.current = Date.now();
    addSystemMessage('Recording started');

    recordingIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setRecordingTime(elapsed);
    }, 1000);
  }, [setIsRecording, addSystemMessage, setRecordingTime]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }

    const newRecording: Recording = {
      id: Date.now().toString(),
      title: `Recording ${recordings.length + 1}`,
      duration: recordingTime,
      size: `${(recordingTime * 0.5).toFixed(1)} GB`,
      date: new Date(),
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300',
    };

    setRecordings(prev => [newRecording, ...prev]);
    setRecordingTime(0);
    addSystemMessage('Recording saved');
  }, [setIsRecording, recordingTime, recordings.length, setRecordings, setRecordingTime, addSystemMessage]);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  return {
    startRecording,
    stopRecording,
  };
};