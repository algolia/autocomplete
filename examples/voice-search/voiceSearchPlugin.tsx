/** @jsxRuntime classic */
/** @jsx h */
import { AutocompletePlugin } from '@algolia/autocomplete-js';
import { h, render } from 'preact';

import { createVoiceSearch, VoiceSearchStatus } from './voiceSearchApi';

type CreateVoiceSearchPluginParams = {
  /**
   * Sets the language of the speech recognition.
   *
   * If not specified, this defaults to the HTML `lang` attribute value, or the user agent's language setting if that isn't set either.
   *
   * @example "en-US"
   */
  language?: string;
};

export function createVoiceSearchPlugin({
  language,
}: CreateVoiceSearchPluginParams): AutocompletePlugin<any, undefined> {
  return {
    subscribe({ setQuery, setIsOpen, refresh }) {
      requestAnimationFrame(() => {
        const inputWrapperSuffix = document.querySelector(
          '.aa-InputWrapperSuffix'
        );

        if (!inputWrapperSuffix) {
          return;
        }

        const input = document.querySelector<HTMLInputElement>('.aa-Input');
        const voiceSearchOverlayContainer = document.createElement('div');
        voiceSearchOverlayContainer.classList.add('aa-VoiceSearchOverlay');

        const voiceSearch = createVoiceSearch({
          language,
          onTranscript(transcript) {
            setQuery(transcript);
            setIsOpen(true);
            refresh();
          },
          onStateChange(state) {
            if (state.status === 'INITIAL') {
              document.body.removeChild(voiceSearchOverlayContainer);
              requestAnimationFrame(() => {
                input.focus();
              });
            } else {
              render(
                <VoiceSearchOverlay
                  status={state.status}
                  transcript={state.transcript}
                  onCancel={voiceSearch.stop}
                />,
                voiceSearchOverlayContainer
              );
            }
          },
        });

        if (!voiceSearch.isBrowserSupported()) {
          return;
        }
        const voiceSearchContainer = document.createElement('div');
        voiceSearchContainer.classList.add('aa-VoiceSearch');

        render(
          <VoiceSearchButton
            onClick={() => {
              voiceSearch.start();
              document.body.appendChild(voiceSearchOverlayContainer);
            }}
          />,
          voiceSearchContainer
        );

        inputWrapperSuffix.appendChild(voiceSearchContainer);

        window.addEventListener('keydown', (event) => {
          if (
            !document.body.contains(voiceSearchOverlayContainer) ||
            event.key !== 'Escape'
          ) {
            return;
          }

          voiceSearch.stop();
        });
      });
    },
    getSources() {
      return [];
    },
  };
}

function VoiceSearchButton({ onClick }) {
  return (
    <button
      className="aa-VoiceSearchButton"
      title="Voice Search"
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      <VoiceSearchIcon />
    </button>
  );
}

function VoiceSearchIcon(props: h.JSX.SVGAttributes<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
      />
    </svg>
  );
}

function getStatusText(status: VoiceSearchStatus) {
  switch (status) {
    case 'LISTENING':
      return 'Listening...';
    case 'RECOGNIZING':
      return 'Recognizing...';
    case 'REQUESTING_PERMISSION':
      return 'Asking permission...';
    case 'ERROR':
      return 'Microphone access is blocked.';
    default:
      return status;
  }
}

function VoiceSearchOverlay({ status, transcript, onCancel }) {
  return (
    <div className="aa-VoiceSearchWrapper">
      <div>{transcript || getStatusText(status)}</div>
      <button
        className="aa-VoiceSearchListeningButton"
        onClick={(event) => {
          event.preventDefault();
          onCancel();
        }}
      >
        <svg
          width="64"
          height="64"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>
    </div>
  );
}
