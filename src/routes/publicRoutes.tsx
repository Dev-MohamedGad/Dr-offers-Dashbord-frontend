import Login from '@pages/auth/loginPage/loginPage.page';
import { Navigate, Route, Routes } from 'react-router-dom';

function PubplicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default PubplicRoutes;
