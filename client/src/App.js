import {BrowserRouter as Router} from 'react-router-dom';
import Main from "./Main.js";

function App() {
  //chiamo il componente Main che si occupa della renderizzazione di tutta la web app
  return (
    <Router>
      <Main></Main>
    </Router>
  );
}

export default App;
