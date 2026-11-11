import { BrowserRouter, Route, Routes } from 'react-router'
import { Page } from '../ui/Page'
import HomePage from './pages/HomePage'
import GroupPage from './pages/GroupPage'
import AuthPage from './pages/AuthPage'

export default function App() {
  return (
    <BrowserRouter>
      <Page>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/g/:id" element={<GroupPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Page>
    </BrowserRouter>
  )
}
