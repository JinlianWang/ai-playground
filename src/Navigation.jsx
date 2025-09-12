import { NavLink } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Box } from '@mui/material'

function Navigation() {
  const pages = [
    { path: '/counter', label: 'Counter' },
    { path: '/rating', label: 'Rating' },
    { path: '/notes', label: 'Notes' }
  ]

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Policy Portal
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          '& .active': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            fontWeight: 'bold'
          }
        }}>
          {pages.map((page) => (
            <NavLink
              key={page.path}
              to={page.path}
              style={({ isActive }) => ({
                color: 'inherit',
                textDecoration: 'none',
                padding: '6px 16px',
                borderRadius: '4px',
                transition: 'background-color 0.3s ease',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                fontWeight: isActive ? 'bold' : 'normal'
              })}
            >
              {page.label}
            </NavLink>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation