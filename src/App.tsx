import { ComponentType } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeStore } from './context/ThemeContext';
import Home from './pages/Home/Home';
import Blur from './pages/Blur/Blur';
import RenderPage from './pages/RenderPage/RenderPage';
import Profiles from './pages/Profiles/Profiles';
import EditProfile from './pages/EditProfile/EditProfile';
import CreateProfile from './pages/CreateProfile/CreateProfile';
import MessageBar from './components/MessageBar/MessageBar';
import { FilesStore } from './context/FilesContext';
import { ProfilesStore } from './context/ProfilesContext';
import { RenderStore } from './context/RenderContext';
import { MessageStore } from './context/MessageContext';
import RenderMessage from './components/RenderMessage/RenderMessage';

import './App.scss';

export interface AnimatedRouteProps {
  component: ComponentType;
  path: string;
  exact?: boolean;
}

function AnimatedRoute({
  component: Component,
  path,
  exact = false,
}: AnimatedRouteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Route component={Component} exact={exact} path={path} />
    </motion.div>
  );
}

function Routes() {
  const location = useLocation();

  return (
    <AnimatePresence initial={false}>
      <Switch location={location} key={location.pathname}>
        <AnimatedRoute exact path="/" component={Home} />

        <AnimatedRoute exact path="/blur" component={Blur} />
        <AnimatedRoute exact path="/blur/render" component={RenderPage} />

        <AnimatedRoute exact path="/profiles" component={Profiles} />

        <Route exact path="/profiles/create" component={CreateProfile} />

        <Route
          exact
          path="/profiles/:profileName/edit"
          component={EditProfile}
        />
      </Switch>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeStore>
        <FilesStore>
          <ProfilesStore>
            <RenderStore>
              <MessageStore>
                <Routes />

                <RenderMessage />
                <MessageBar />
              </MessageStore>
            </RenderStore>
          </ProfilesStore>
        </FilesStore>
      </ThemeStore>
    </Router>
  );
}
