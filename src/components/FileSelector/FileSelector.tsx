import { useDropzone } from 'react-dropzone';

import './FileSelector.scss';

interface FileSelectorProps {
  label: string;
  height?: number;
  onFileSelect: (files: File[]) => void;
}

export default function FileSelector({
  label,
  height,
  onFileSelect,
}: FileSelectorProps) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'video/*',
    onDrop: onFileSelect,
  });

  return (
    <div style={{ height }} className="file-selector" {...getRootProps()}>
      <input {...getInputProps()} />
      {label}
    </div>
  );
}
