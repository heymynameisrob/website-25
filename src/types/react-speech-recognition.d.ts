declare module "react-speech-recognition" {
  export interface UseSpeechRecognitionOptions {
    transcribing?: boolean;
    clearTranscriptOnListen?: boolean;
    commands?: Array<{
      command: string | string[] | RegExp;
      callback: (...args: string[]) => void;
      isFuzzyMatch?: boolean;
      fuzzyMatchingThreshold?: number;
      bestMatchOnly?: boolean;
    }>;
  }

  export interface UseSpeechRecognitionReturn {
    transcript: string;
    interimTranscript: string;
    finalTranscript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
    isMicrophoneAvailable: boolean;
  }

  export function useSpeechRecognition(options?: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn;

  export interface SpeechRecognitionStatic {
    startListening(options?: { continuous?: boolean; interimResults?: boolean; language?: string }): Promise<void>;
    stopListening(): Promise<void>;
    abortListening(): Promise<void>;
    browserSupportsSpeechRecognition(): boolean;
    browserSupportsContinuousListening(): boolean;
    applyPolyfill(PolyfillSpeechRecognition: unknown): void;
    removePolyfill(): void;
  }

  export const SpeechRecognition: SpeechRecognitionStatic;
  export { SpeechRecognition as default };
}
