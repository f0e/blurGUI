import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import RenderContext from '../../context/RenderContext';
import LinearProgressWithLabel from '../../components/ProgressBar/ProgressBar';

export default function RenderPage() {
  const { getRenderQueue, getActiveRender } = useContext(RenderContext);

  const renderQueue = getRenderQueue();
  const activeRender = getActiveRender();

  return (
    <main className="render-page">
      <h3>rendering</h3>

      {renderQueue.length === 0 ? (
        <div>all renders finished</div>
      ) : (
        renderQueue.map((render, i) => (
          <div
            style={{
              fontWeight: render === activeRender?.render ? 'bold' : 'normal',
            }}
            key={i}
          >
            {render.file.name} - {render.profile.name}
          </div>
        ))
      )}

      {activeRender && (
        <LinearProgressWithLabel
          variant="determinate"
          value={activeRender.progress * 100}
        />
      )}

      <br />

      <div className="links">
        <Link to="/">
          <Button variant="outlined" size="small">
            back
          </Button>
        </Link>
      </div>
    </main>
  );
}
