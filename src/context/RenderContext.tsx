import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import BlurProfile from '../types/BlurProfile';
import Render from '../types/Render';
import { runBlur } from '../util/rendering';
import SettingsContext from './SettingsContext';

export interface IRenderContext {
  getRenderQueue: () => Render[];
  getActiveRender: () => RenderProgress | null;
  queueRender: (file: File, profile: BlurProfile) => void;
}

const RenderContext = createContext({} as IRenderContext);

export interface RenderProgress {
  render: Render;
  progress: number;
}

export const RenderStore: FunctionComponent = ({ children }) => {
  const [renderQueue, setRenderQueue] = useState<Render[]>([]);
  const [activeRender, setActiveRender] = useState<RenderProgress | null>(null);

  const { getSettings } = useContext(SettingsContext);

  const doRender = async (render: Render) => {
    setActiveRender({
      render,
      progress: 0,
    });

    const onProgress = (progress: number) => {
      setActiveRender((curActiveRender) =>
        !curActiveRender
          ? curActiveRender
          : {
              ...curActiveRender,
              progress,
            }
      );
    };

    await runBlur(getSettings(), render, onProgress);

    setActiveRender(null);
    setRenderQueue((curQueue) => curQueue.slice(1));
  };

  useEffect(() => {
    if (renderQueue.length > 0 && !activeRender) {
      console.log('Queue changed, ', renderQueue);

      const render = renderQueue[0];
      doRender(render);
    }
  }, [renderQueue]);

  const getRenderQueue = () => renderQueue;
  const getActiveRender = () => activeRender;

  const queueRender = (file: File, profile: BlurProfile) => {
    const render: Render = {
      file,
      profile,
    };

    setRenderQueue((curQueue) => [...curQueue, render]);
  };

  return (
    <RenderContext.Provider
      value={{
        getRenderQueue,
        getActiveRender,
        queueRender,
      }}
    >
      {children}
    </RenderContext.Provider>
  );
};

export default RenderContext;
