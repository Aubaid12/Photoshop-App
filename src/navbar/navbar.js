import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { List, ListItem } from '@mui/material'

export default function Navbar() {
  return (
    <>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6">
          <b>Photoshop App </b>
        </Typography>
        <List sx={{display:"flex", marginLeft:"auto"}}>
            <ListItem>
                <a style = {{ textDecoration:"none", color: "white"}} href = "/">
                    Home 
                </a>
            </ListItem>

            <ListItem>
                <a style = {{ textDecoration:"none", color: "white"}} href = "/about">
                    About&nbsp;Us
                </a>
            </ListItem>

            <ListItem>
            <a style = {{ textDecoration:"none", color: "white"}} href = "/contact">
                    Contact
                </a>
            </ListItem>
            
        </List>
      </Toolbar>
    </AppBar>
    </>
  )
}
