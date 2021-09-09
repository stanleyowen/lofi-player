import React, { useEffect, useState } from 'react'
import { Button, Dialog, Tooltip, DialogActions, DialogContent, DialogContentText } from '@material-ui/core'
import { Beta, HomeOutline, HomeSolid, AboutSolid, AboutOutline, SearchSolid, SearchOutline } from '../lib/icons.component'

const SideBar = ({ handleChange, properties }: any) => {
    const [isOpen, setDialog] = useState<boolean>(false)

    useEffect(() => {
        document.getElementById('tabs')?.childNodes.forEach(tab =>
            (tab.childNodes[0] as HTMLElement).innerText.toLowerCase() === properties.activeTab ?
                (tab as HTMLElement).classList.add('active') :
                (tab as HTMLElement).classList.remove('active')
        )
    }, [properties])

    const switchTab = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        const target = ((e.target as HTMLElement).ownerDocument.activeElement?.childNodes[0].childNodes[1] as HTMLElement).innerText.toLowerCase()
        if(target !== properties.activeTab && target !== 'beta') handleChange({ id: 'activeTab', value: target })
    }

    return (
        <div className="sidebar">
            <div id="tabs" onClick={switchTab}>
                {
                    ['Home', 'Search', 'About'].map((tab, index) => {
                        const components: { [key: string]: any } = { HomeSolid, HomeOutline, SearchSolid, SearchOutline, AboutSolid, AboutOutline }
                        const SolidIcon = components[`${tab}Solid`]
                        const OutlineIcon = components[`${tab}Outline`]
                        return (
                            <Tooltip title={tab} enterDelay={500} enterNextDelay={500} key={index}>
                                <Button className="w-100 rounded-corner p-10 tab" id={tab.toLowerCase()}>
                                    <div className="w-30">{properties.activeTab === tab.toLowerCase() ? <SolidIcon /> : <OutlineIcon />}</div>
                                    <div className="w-70 left-align">{tab.toLowerCase()}</div>
                                </Button>
                            </Tooltip>
                        )
                    })
                }
                {
                    process.env.REACT_APP_ALLOW_BETA === 'true' ?
                        process.env.REACT_APP_CONTEXT === 'production' ?
                            (<Button className="w-100 rounded-corner p-10 tab" id="beta" onClick={() => setDialog(true)}>
                                <div className="w-30"><Beta /></div>
                                <div className="w-70 left-align">Beta</div>
                            </Button>) :
                            (<Button className="w-100 rounded-corner p-10 tab" id="beta" onClick={() => window.location.href = String(process.env.REACT_APP_STABLE)}>
                                <div className="w-30"><Beta /></div>
                                <div className="w-70 left-align">Stable</div>
                            </Button>)
                        : null
                }
            </div>

            <Dialog open={isOpen} onClose={() => setDialog(false)}>
                <DialogContent>
                    <DialogContentText>
                        <p className="warning">Stability: Experimental</p>
                        <p className="mt-10">This is an experimental feature which is still under active development and subject to non-backward compatible changes or removal in any future version. Use of the feature is not recommended in production environments.</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialog(false)}>Cancel</Button>
                    <Button color="secondary" onClick={() => window.location.href = String(process.env.REACT_APP_BETA)}>Continue</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default SideBar