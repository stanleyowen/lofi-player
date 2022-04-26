import React, { useState, useEffect } from 'react'
import { Close } from '../lib/icons.component'
import { Skeleton, TextField, IconButton } from '@mui/material'

const Search = ({ songData, HOST_DOMAIN }: any) => {
    const items: any = {
        music: [],
        author: []
    }
    const [results, setResult] = useState<any>({
        music: [],
        author: []
    })
    const [keyword, setKeyword] = useState<string>('')
    const [isFetching, setFetching] = useState<boolean>(false)

    useEffect(() => {
        if(keyword) {
            setFetching(true)
            const music: any = []
            const author: any = []
            for (let i=0; i<songData.length; i++) {
                if(String(songData[i].title).toLowerCase().includes(keyword)) music.push(songData[i])
                if(String(songData[i].author).toLowerCase().includes(keyword)) author.push(songData[i])
            }
            setResult({ music, author })
            setFetching(false)
        }
    }, [keyword, songData])

    if(keyword) {
        if(isFetching)
            for(let i=0; i<4; i++) {
                items.push(
                    <div className="m-10" key={i}>
                        <div className="large-card">
                            <Skeleton variant="circular" height={200} animation="wave" />
                            <div className="flex">
                                <span className="mt-10 w-70"><Skeleton variant="text" animation="wave" /></span>
                                <span className="w-40"><Skeleton variant="text" animation="wave" /></span>
                            </div>
                        </div>
                    </div>
                )
            }
        else if (results?.length > 0)
            results.map((music: any, index: any) => {
                return items.push(
                    <div className="m-10" key={index}>
                        <div className="large-card">
                            <img src={HOST_DOMAIN+music.image} />
                            <div className="flex">
                                <div className="m-auto w-70">
                                    <h3 className="mt-10">{music.title}</h3>
                                    <p className="author">{music.author}</p>
                                </div>
                                <button className="play-btn m-auto" id={(music.title+music.author).replace(/\s/g, "-")}></button>
                            </div>
                        </div>
                    </div>
                )
            })
        else if(!isFetching && results?.length === 0) items.push(<div>No Results Found for <b>{keyword}</b></div>)
    }

    const ClearQuery = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setKeyword('')
        document.getElementById('search-query')?.focus()
    }

    return (
        <div className="m-10">
            <div className="flex">
                <TextField label="Search (Artists or Songs)" variant="outlined" className="search" value={keyword} onChange={e => setKeyword(e.target.value)} id="search-query" autoFocus autoComplete="off" />
                <IconButton className={(keyword ? null : 'none') + " p-10 close-btn"} onClick={ClearQuery} size="large">{Close()}</IconButton>
            </div>
            <div className="mt-30 col-4" id="playlist">{items}</div>
        </div>
    )
}

export default Search