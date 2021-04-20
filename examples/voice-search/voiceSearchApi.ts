export type VoiceSearchStatus =
  | 'INITIAL'
  | 'REQUESTING_PERMISSION'
  | 'LISTENING'
  | 'RECOGNIZING'
  | 'ERROR';

type VoiceSearchState = {
  status: VoiceSearchStatus;
  transcript: string;
  errorCode: SpeechRecognitionErrorCode | null;
};

type CreateVoiceSearchParams = {
  language?: string;
  onStateChange(state: VoiceSearchState): void;
  onTranscript(transcript: string): void;
};

type VoiceSearchApi = {
  isBrowserSupported(): boolean;
  start(): void;
  stop(): void;
};

function createState(state: Partial<VoiceSearchState>): VoiceSearchState {
  return {
    status: 'INITIAL',
    transcript: '',
    errorCode: null,
    ...state,
  };
}

export function createVoiceSearch({
  language,
  onTranscript,
  onStateChange,
}: CreateVoiceSearchParams): VoiceSearchApi {
  const SpeechRecognitionAPI: new () => SpeechRecognition =
    (window as any).webkitSpeechRecognition ||
    (window as any).SpeechRecognition;
  let state: VoiceSearchState = createState({});
  let recognition: SpeechRecognition | undefined;

  function isBrowserSupported() {
    return Boolean(SpeechRecognitionAPI);
  }

  function setState(newState: Partial<VoiceSearchState>) {
    state = { ...state, ...newState };
    onStateChange(state);
  }

  function onStart() {
    setState({ status: 'LISTENING' });
  }

  function onError(event: SpeechRecognitionErrorEvent) {
    setState({ status: 'ERROR', errorCode: event.error });
  }

  function onResult(event: SpeechRecognitionEvent) {
    setState({
      status: 'RECOGNIZING',
      transcript:
        (event.results[0] &&
          event.results[0][0] &&
          event.results[0][0].transcript) ||
        '',
    });
  }

  function onEnd() {
    if (!state.errorCode && state.transcript) {
      onTranscript(state.transcript);
    }

    if (state.status !== 'ERROR') {
      setState(createState({ status: 'INITIAL' }));
    }
  }

  function start() {
    recognition = new SpeechRecognitionAPI();
    if (!recognition) {
      return;
    }

    setState(createState({ status: 'REQUESTING_PERMISSION' }));
    recognition.interimResults = true;
    if (language) {
      recognition.lang = language;
    }
    recognition.addEventListener('start', onStart);
    recognition.addEventListener('error', onError);
    recognition.addEventListener('result', onResult);
    recognition.addEventListener('end', onEnd);
    recognition.start();
  }

  function stop() {
    if (!recognition) {
      return;
    }

    recognition.stop();
    recognition.removeEventListener('start', onStart);
    recognition.removeEventListener('error', onError);
    recognition.removeEventListener('result', onResult);
    recognition.removeEventListener('end', onEnd);
    recognition = undefined;

    setState(createState({ status: 'INITIAL' }));
  }

  return {
    isBrowserSupported,
    start,
    stop,
  };
}
