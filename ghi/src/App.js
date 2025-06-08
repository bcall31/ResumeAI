import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import Home from './containers/home';
import Navi from './containers/navi'; 
import Resume from './containers/submit';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'


function App() {

  return (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <Navi/>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/resume' element={<Resume/>}/>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  )
}

export default App
