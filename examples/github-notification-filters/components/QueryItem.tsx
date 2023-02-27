/** @jsxRuntime classic */
/** @jsx h */
import { h } from 'preact';

type QueryItemProps = {
  query: string;
};

export function QueryItem({ query }: QueryItemProps) {
  return (
    <div className="aa-ItemWrapper">
      <div className="aa-ItemContent">
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <strong>{query}</strong> - submit
          </div>
        </div>
      </div>
    </div>
  );
}
