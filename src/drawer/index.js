import React, { useState } from 'react'
import {Accordion, AccordionDetails, AccordionSummary, Alert, Box, IconButton, List, ListItem, ListItemText, Slider, Snackbar, Typography} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

export default function Drawercomponent({image,setImage,setActions,Actions,setbackDrop}) {
    const [snackbar, setSnackbar] = useState(false)
    const filters = [
        {'title': 'Grayscale','filter': 'grayscale', "image":"/image_filters/grayscale.png"},
        {'title': 'Cartoon', 'filter':'cartoon', "image":"/image_filters/cartoon.png"},
        {'title': 'Sharpen','filter': 'sharpen', "image":"/image_filters/sharpen.png"},
        {'title': 'Emboss','filter': 'emboss', "image":"/image_filters/emboss.png"},
        {'title': 'Threshold','filter': 'threshold', "image":"/image_filters/threshold.png"},
        {'title': 'Gaussian Blur','filter': 'gaussian_blur', "image":"/image_filters/gaussian_blur.png"},
        {'title': 'Hsv','filter': 'hsv', "image":"/image_filters/hsv.png"},
        {'title': 'Canny','filter': 'canny', "image":"/image_filters/canny.png"},
        {'title': 'Emboss2','filter': 'emboss2', "image":"/image_filters/emboss2.png"},
        {'title': 'Vignette','filter': 'vignette', "image":"/image_filters/vignette.png"},
        {'title': 'Sketch','filter': 'sketch', "image":"/image_filters/sketch.png"},
        {'title': 'Sepia','filter': 'sepia', "image":"/image_filters/sepia.png"},
        {'title': '4R','filter': '4r', "image":"/image_filters/4r.png"},
        {'title': 'Negative','filter': 'negative', "image":"/image_filters/negative.png"}
        ]
        const Mirror = [
            {'title': 'Flip Horizontal','filter': 'flip_horizontal',"image":"/image_filters/flip_horizontal.png"},
            {'title': 'Flip Vertical','filter': 'flip_vertical',"image":"/image_filters/flip_vertical.png"},
            {'title': 'Flip both Axis','filter': 'flip_both',"image":"/image_filters/4r.png"},
            {'title': 'Transpose','filter': 'transpose',"image":"/image_filters/transpose.png"},
        ]
        const callBackend = async(filter)=>{
            if(!image)
                alert("please select an Image")
            else{
                try {
                   setbackDrop(true)
                   var response = await axios.post("https://photoshop-app.onrender.com/filter", {filter:filter,image:image})
                   console.log(response.data)
                   setImage(response.data["image"])
                   console.log("responseRecieved")
                   setbackDrop(false) 
                } catch (error) {
                    console.log("following error occured",error)
                }
            }

        } 

  return (
    <Box>
        <Snackbar anchorOrigin={{vertical:"bottom",horizontal:"right"}} autoHideDuration={5000} open = {snackbar} onClose={()=>{setSnackbar(false)}}>
            <Alert severity='error' variant='filled' action = {<IconButton onClick={()=>{setSnackbar(false)}}><CloseIcon/></IconButton>}>
            error processing image
            </Alert>
        </Snackbar>
        <Accordion>
            <AccordionSummary expandIcon = {<ExpandMoreIcon/>}>
                Contrast and Brightness 
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    <Box>
                        <Box>
                            <ListItem><ListItemText>brightness</ListItemText></ListItem>
                            <ListItem><Slider size='small' max={100} min={-100} valueLabelDisplay='auto' defaultValue={0} step={1}/></ListItem>
                        </Box>
                        <Box>
                            <ListItem><ListItemText>contrast</ListItemText></ListItem>
                            <ListItem><Slider size='small' max={100} min={-100} valueLabelDisplay='auto' defaultValue={0} step={1}/></ListItem>
                        </Box>
                    </Box>
                </List>
            </AccordionDetails>

        </Accordion>


        <Accordion>
            <AccordionSummary expandIcon = {<ExpandMoreIcon/>} >
                Filters
            </AccordionSummary>
            <AccordionDetails>
                {filters.map((arg,index)=>(<Box sx={{display:'flex', alignItems:'center', cursor: 'pointer'}} index={index}><Box><ListItem onClick={()=>{callBackend(arg.filter)}}><img src= {arg.image} alt={arg.title} style={{width:"4vw", height:"auto"}}/>&emsp;<Typography>{arg.title}</Typography></ListItem></Box></Box>))}
            </AccordionDetails>
        </Accordion>

        <Accordion>
            <AccordionSummary expandIcon = {<ExpandMoreIcon/>} >
                Flip and Mirror
            </AccordionSummary>
            <AccordionDetails>
                {Mirror.map((arg,index)=>(<Box sx={{display:'flex', alignItems:'center', cursor: 'pointer'}} index={index}><Box><ListItem onClick={()=>{callBackend(arg.filter)}}><img src= {arg.image} alt={arg.title} style={{width:"4vw", height:"auto"}}/>&emsp;<Typography>{arg.title}</Typography></ListItem></Box></Box>))}
            </AccordionDetails>
        </Accordion>
    </Box>
  )
}
