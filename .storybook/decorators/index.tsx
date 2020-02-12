/** @jsx h */

import { h, render } from 'preact';

interface StoryProps {
  container: HTMLElement;
  dropdownContainer: HTMLElement;
}

type StoryFn = ({ container, dropdownContainer }: StoryProps) => void;

interface StoryOptions {
  searchBoxPosition: 'left' | 'right';
}

export function withPlayground(storyFn: StoryFn, options?: StoryOptions) {
  return () => {
    const root = document.createElement('div');

    function Playground() {
      return (
        <main
          style={{
            border: '2px solid #f5f5fa',
            borderRadius: 3,
            padding: '1rem',
          }}
        >
          <Header searchBoxPosition={options?.searchBoxPosition}>
            <div id="autocomplete-container" />
          </Header>

          <Content />

          <div id="autocomplete-dropdown-container" />
        </main>
      );
    }

    render(<Playground />, root);

    storyFn({
      container: root.querySelector<HTMLElement>('#autocomplete-container')!,
      dropdownContainer: root.querySelector<HTMLElement>(
        '#autocomplete-dropdown-container'
      )!,
    });

    return root;
  };
}

function Header({ searchBoxPosition, children }) {
  const sharedHeaderStyle = {
    padding: '0.5rem 1rem',
    background: '#f5f5fa',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 3,
  };

  switch (searchBoxPosition) {
    case 'left':
      return (
        <header
          style={{
            ...sharedHeaderStyle,
            flex: '1fr 3fr',
          }}
        >
          {children}
          <h1 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Website</h1>
        </header>
      );
    case 'right':
      return (
        <header
          style={{
            ...sharedHeaderStyle,
            flex: '3fr 1fr',
          }}
        >
          <h1 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Website</h1>
          {children}
        </header>
      );
    default:
      return <header>{children}</header>;
  }
}

function Content() {
  return (
    <div
      style={{
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '200px 200px',
        gridGap: '1rem',
      }}
    >
      <div style={{ background: '#f5f5fa', borderRadius: 3 }} />
      <div style={{ background: '#f5f5fa', borderRadius: 3 }} />
      <div style={{ background: '#f5f5fa', borderRadius: 3 }} />
      <div style={{ background: '#f5f5fa', borderRadius: 3 }} />
    </div>
  );
}
