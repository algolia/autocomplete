/** @jsx h */
import { AutocompletePlugin } from '@algolia/autocomplete-js';
import { h, render } from 'preact';

import { createVoiceSearch, VoiceSearchStatus } from './voiceSearchApi';

type CreateVoiceSearchPluginParams = {
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
          searchAsYouSpeak: false,
          onTranscript(transcript) {
            setQuery(transcript);
            setIsOpen(true);
            refresh();
            requestAnimationFrame(() => {
              input.focus();
            });
          },
          onStateChange(state) {
            if (state.status === 'finished' || state.status === 'error') {
              document.body.removeChild(voiceSearchOverlayContainer);
            } else {
              render(
                <VoiceSearchOverlay
                  status={state.status}
                  transcript={state.transcript}
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
              voiceSearch.startListening();
              document.body.appendChild(voiceSearchOverlayContainer);
            }}
          />,
          voiceSearchContainer
        );

        inputWrapperSuffix.appendChild(voiceSearchContainer);
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
    case 'waiting':
      return 'Listening...';
    case 'recognizing':
      return 'Recognizing...';
    case 'askingPermission':
      return 'Asking permission...';
    default:
      return status;
  }
}

function VoiceSearchOverlay({ status, transcript }) {
  return (
    <div className="aa-VoiceSearchWrapper">
      <div>{transcript || getStatusText(status)}</div>
      <svg
        width="48"
        height="48"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        ></path>
      </svg>
    </div>
  );
}
