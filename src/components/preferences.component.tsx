import React from 'react'
import { Button, Accordion, AccordionSummary } from '@mui/material'

import Theme from '../lib/theme.json'
import { Themes, Expand } from '../lib/icons.component'

const About = () => {
    const setTheme = (url: string | Boolean) => {
        const background = document.getElementById('backdrop-image')
        if(url && background) background.style.background = `url(${url})`
        else background?.removeAttribute('style')
    }
    
    return (
        <div className="m-10" id="version">
            <Accordion className="w-100 card mt-10">
                <AccordionSummary expandIcon={<Expand />}>
                    <div className="flex w-80">
                        <Themes />
                        <p className="ml-10">Themes</p>
                    </div>
                </AccordionSummary>
                <div className="p-10">
                    {
                        Theme.map(theme => {
                            return <Button onClick={() => setTheme(theme.image)}>
                                {theme.type}
                            </Button>
                        })
                    }
                </div>
            </Accordion>
        </div>
    )
}

export default About