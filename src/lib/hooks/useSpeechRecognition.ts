import { useSpeechRecognition as useReactSpeechRecognition } from "react-speech-recognition";
import SpeechRecognition from "react-speech-recognition";

type SpeechRecognitionState = "inactive" | "listening" | "error";

type UseSpeechRecognitionReturn = {
  finalTranscript: string;
  interimTranscript: string;
  state: SpeechRecognitionState;
  isSupported: boolean;
  start: () => void;
  stop: () => void;
};

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const {
    interimTranscript,
    finalTranscript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useReactSpeechRecognition({
    transcribing: true,
    clearTranscriptOnListen: true,
  });

  const start = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, interimResults: true });
  };

  const stop = () => {
    SpeechRecognition.stopListening();
  };

  const state: SpeechRecognitionState = listening ? "listening" : "inactive";

  return {
    finalTranscript,
    interimTranscript,
    state,
    isSupported: browserSupportsSpeechRecognition,
    start,
    stop,
  };
}
