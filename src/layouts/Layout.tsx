import { Routes, Route } from 'react-router-dom';
import Home from 'pages/home/Home';
import List from 'pages/list/List';

function Layout() {
  return (
    <div>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employee-list" element={<List />} />
        </Routes>
      </div>
    </div>
  );
}

export default Layout;