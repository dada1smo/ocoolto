import { BrowserRouter, Route, Routes } from 'react-router'
import { MyGroupsProvider } from '../domain/group/useMyGroups'
import { Page } from '../ui/Page'
import HomePage from './pages/HomePage'
import GroupPage from './pages/GroupPage'
import AuthPage from './pages/AuthPage'
import MyGroupsPage from './pages/MyGroupsPage'

export default function App() {
  return (
    <BrowserRouter>
      <MyGroupsProvider>
        <Page>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/g/:id" element={<GroupPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/meus-grupos" element={<MyGroupsPage />} />
          </Routes>
        </Page>
      </MyGroupsProvider>
    </BrowserRouter>
  )
}
