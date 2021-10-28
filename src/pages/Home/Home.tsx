import { useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button } from '@mui/material';
import FileSelector from '../../components/FileSelector/FileSelector';
import FilesContext from '../../context/FilesContext';

import './Home.scss';

export default function Home() {
  const { addFiles } = useContext(FilesContext);

  const history = useHistory();

  return (
    <main className="home-page">
      <h1>blur</h1>

      <FileSelector
        onFileSelect={(files: File[]) => {
          addFiles(files);
          history.push('/blur');
        }}
        label="drag videos here, or click to select"
      />

      <br />

      <div className="links">
        <Link to="/profiles">
          <Button variant="outlined" size="small">
            profiles
          </Button>
        </Link>

        <Button variant="outlined" size="small">
          settings
        </Button>
      </div>
    </main>
  );
}
