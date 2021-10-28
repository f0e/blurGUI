import { createContext, FunctionComponent, useState } from 'react';

export interface IFilesContext {
  getFiles: () => File[];
  addFiles: (files: File[]) => void;
  clearFiles: () => void;
}

const FilesContext = createContext({} as IFilesContext);

export const FilesStore: FunctionComponent = ({ children }) => {
  const [files, setFiles] = useState<File[]>([]);

  const getFiles = () => files;
  const addFiles = (files: File[]) =>
    setFiles((curFiles) => curFiles.concat(files));
  const clearFiles = () => setFiles([]);

  return (
    <FilesContext.Provider
      value={{
        getFiles,
        addFiles,
        clearFiles,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};

export default FilesContext;
