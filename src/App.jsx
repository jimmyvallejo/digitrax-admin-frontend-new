
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SideNav from './components/SideNav';
import Dashboard from './pages/Dashboard';
import DataTableContext from './context/DataTableContext';
import SongDetails from './pages/SongDetails';
import SongDetailsProvider from './context/SongDetailsContext.jsx';
import CreateSong from './pages/CreateSong';
import CrossDashboard from './pages/CrossDashboard.jsx';
import Reports from './pages/Reports.jsx';

const App = () => {
  return (
    <>
      <DataTableContext>
        <SideNav />
        <SongDetailsProvider>
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/crossDashboard" element={<CrossDashboard />} />
              <Route path="/songdata" element={<SongDetails />} />
              <Route path='/createsong' element={<CreateSong />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </SongDetailsProvider>

      </DataTableContext>

  </>
  );
};

export default App;
