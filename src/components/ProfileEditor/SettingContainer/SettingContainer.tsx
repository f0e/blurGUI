import './SettingContainer.scss';

interface SettingsContainerProps {
  children: React.ReactNode;
  margin?: string;
  className?: string;
}

export default function SettingContainer({
  children,
  margin,
  className,
}: SettingsContainerProps) {
  return (
    <div
      className={'setting-container ' + (className ? className : '')}
      style={{ marginBottom: margin ? margin : '' }}
    >
      {children}
    </div>
  );
}
