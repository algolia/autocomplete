export type VoiceSearchStatus =
  | 'initial'
  | 'askingPermission'
  | 'waiting'
  | 'recognizing'
  | 'finished'
  | 'error';

type VoiceSearchState = {
  status: VoiceSearchStatus;
  transcript: string;
  isSpeechFinal: boolean;
  errorCode?: string;
};

type CreateVoiceSearchParams = {
  searchAsYouSpeak: boolean;
  language?: string;
  onStateChange(state: VoiceSearchState): void;
  onTranscript(transcript: string): void;
};

type VoiceSearchApi = {
  isBrowserSupported(): boolean;
  startListening(): void;
  stopListening(): void;
  destroy(): void;
};

function createState(state: Partial<VoiceSearchState>): VoiceSearchState {
  return {
    status: 'initial',
    transcript: '',
    isSpeechFinal: false,
    errorCode: undefined,
    ...state,
  };
}

export function createVoiceSearch({
  searchAsYouSpeak,
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
    setState({ status: 'waiting' });
  }

  function onError(event: SpeechRecognitionErrorEvent) {
    setState({ status: 'error', errorCode: event.error });
  }

  function onResult(event: SpeechRecognitionEvent) {
    setState({
      status: 'recognizing',
      transcript:
        (event.results[0] &&
          event.results[0][0] &&
          event.results[0][0].transcript) ||
        '',
      isSpeechFinal: event.results[0] && event.results[0].isFinal,
    });
    if (searchAsYouSpeak && state.transcript) {
      onTranscript(state.transcript);
    }
  }

  function onEnd() {
    if (!state.errorCode && state.transcript && !searchAsYouSpeak) {
      onTranscript(state.transcript);
    }

    if (state.status !== 'error') {
      setState({ status: 'finished' });
    }
  }

  function startListening() {
    recognition = new SpeechRecognitionAPI();
    if (!recognition) {
      return;
    }

    setState({ status: 'askingPermission' });
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

  function destroy() {
    if (!recognition) {
      return;
    }

    recognition.stop();
    recognition.removeEventListener('start', onStart);
    recognition.removeEventListener('error', onError);
    recognition.removeEventListener('result', onResult);
    recognition.removeEventListener('end', onEnd);
    recognition = undefined;
  }

  function stopListening() {
    destroy();
    // Because `destroy` removes event listeners, `end` listener is not called.
    // So we're setting the `status` as `finished` here.
    // If we don't do it, it will be still `waiting` or `recognizing`.
    setState({ status: 'finished' });
  }

  return {
    isBrowserSupported,
    startListening,
    stopListening,
    destroy,
  };
}
