import { BrowserRouter, Route, Routes } from 'react-router'
import { MyGroupsProvider } from '../domain/group/useMyGroups'
import { Page } from '../ui/Page'
import HomePage from './pages/HomePage'
import GroupPage from './pages/GroupPage'
import AuthPage from './pages/AuthPage'
import EntrarPage from './pages/EntrarPage'
import MyGroupsPage from './pages/MyGroupsPage'
import RootPage from './pages/RootPage'

export default function App() {
  return (
    <BrowserRouter>
      <MyGroupsProvider>
        <Page>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/g/:id" element={<GroupPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/entrar" element={<EntrarPage />} />
            <Route path="/meus-grupos" element={<MyGroupsPage />} />
            <Route path="/root" element={<RootPage />} />
          </Routes>
        </Page>
      </MyGroupsProvider>
    </BrowserRouter>
  )
}
