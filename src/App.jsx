import './App.css'
import { Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import GlobalModal from "./components/common/GlobalModal";
import ProtectedRoute from './components/common/ProtectedRoute';
import MyPage from './pages/MyPage';
import OAuthSuccess from './pages/OAuthSuccess';
import MyOmamoriSection from './components/omamori/MyOmamoriSection';
import FortuneListPage from './pages/FortuneListPage';
import OmamoriEdit from './pages/OmamoriEdit';
import SharePage from './pages/SharePage';

function App() {
  return (
    <>
      <GlobalModal />
      

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/oauth/callback" element={<OAuthSuccess />} />

        <Route path="/mypage" element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
          }
        >
          <Route index element={<MyOmamoriSection />} /> 
          {/* <Route path="posts" element={<MyPostsSection />} />
          <Route path="bookmarks" element={<MyBookmarksSection />} /> */}
        </Route>

        <Route path="/omamori/edit/:id" element={ 
          <ProtectedRoute>
            <OmamoriEdit /> 
          </ProtectedRoute>
        }
      />

        <Route path="/fortune-list" element={
          <ProtectedRoute>
            <FortuneListPage />
          </ProtectedRoute>
          }
        />   

        <Route path="/share/:token" element={<SharePage />} />

      </Routes>
    </>
  );
}

export default App;
