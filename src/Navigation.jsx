import { NavLink } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'

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
        <Box sx={{ display: 'flex', gap: 1 }}>
          {pages.map((page) => (
            <Button
              key={page.path}
              component={NavLink}
              to={page.path}
              color="inherit"
              sx={{
                textDecoration: 'none',
                '&.active': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1
                }
              }}
            >
              {page.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation