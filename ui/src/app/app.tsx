import { useState } from 'react';
import { AppRoutes } from './routes';
import axios from 'axios';
import CustomSpinner from './common/custom-spinner/custom-spinner';

export function App() {
  const [load, setLoad] = useState<any>();
  axios.interceptors.request.use(request => {
    setLoad(true);
    return request;
  });

  axios.interceptors.response.use(response => {
    setLoad(false);
    return response;
  }, error => {
    setLoad(false);
    throw error;
  });
  
  return(
    <>
    <CustomSpinner loading={load} />
    <AppRoutes />
    </>
  ) 
}

export default App;
