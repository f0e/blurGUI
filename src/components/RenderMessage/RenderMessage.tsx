import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import RenderContext from '../../context/RenderContext';
import LinearProgressWithLabel from '../../components/ProgressBar/ProgressBar';

import './RenderMessage.scss';

export default function RenderMessage(props: any) {
  const { getRenderQueue, getActiveRender } = useContext(RenderContext);

  const location = useLocation();
  const blacklistedPages = ['/blur/render'];

  const renderQueue = getRenderQueue();
  const activeRender = getActiveRender();

  const rendersWaiting = renderQueue.length - 1;
  const showingMessage =
    activeRender && !blacklistedPages.includes(location.pathname);

  return (
    <div
      className={[`render-message`, !showingMessage ? 'hidden' : ''].join(' ')}
    >
      {activeRender && (
        <>
          <div className="render-name">
            {activeRender.render.file.name.split('.')[0]}
          </div>
          <div className="render-progress">
            <LinearProgressWithLabel
              variant="determinate"
              labelSide="left"
              value={activeRender.progress * 100}
            />
          </div>
          {rendersWaiting > 0 && (
            <div className="render-left">{rendersWaiting} waiting</div>
          )}
        </>
      )}
    </div>
  );
}
