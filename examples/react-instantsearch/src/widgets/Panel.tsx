export function Panel({
  children,
  header,
  footer,
}: React.PropsWithChildren<{
  header?: React.ReactNode;
  footer?: React.ReactNode;
}>) {
  return (
    <div className="ais-Panel">
      {header && <div className="ais-Panel-header">{header}</div>}
      <div className="ais-Panel-body">{children}</div>
      {footer && <div className="ais-Panel-footer">{footer}</div>}
    </div>
  );
}
