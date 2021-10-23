import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { onSnapshot, query, where, getFirestore, collection } from 'firebase/firestore'
import { getTokenValue } from './lib/functions.component'
import { Properties } from './lib/interfaces.component'
import Auth from './components/auth.component'
import AppLayout from './components/app.component'
import SideBar from './components/sidebar.component'
import { initializeApp } from '@firebase/app'

process.env.NODE_ENV === 'production' ? require ('./App.min.css') : require('./App.css')

// eslint-disable-next-line
export default function App() {
  const [auth, setAuth] = useState<{
    isLoading: boolean,
    loggedIn: boolean
  }>({
    isLoading: true,
    loggedIn: false
  })
  const config: any = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DB_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_SENDER_ID,
    appId: process.env.REACT_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  }
  const [properties, setProperties] = useState<Properties>({
    action: 0,
    activeTab: window.localStorage.getItem('tab-session') ?? 'home',
    history: [window.localStorage.getItem('tab-session') ?? 'home']
  })

  useEffect(() => {
    for (let i = 0; i < 79; i++) {
      const div = document.createElement('div')
      div.style.opacity = `${Math.random() * (0.075 - 0.025) + 0.025}`
      document.querySelector('.backdrop-overlay')?.appendChild(div)
    }
    initializeApp(config)
    const token = getTokenValue()
    onSnapshot(
      query(collection(getFirestore(), "token"),
      where("token", "==", token)
    ), (tokens) => {
      tokens.forEach(data => {
        if(data.data() && String(data.data()?.token) === token) handleCredential({
            isLoading: false,
            loggedIn: true
        })
      })
    })
  }, [])

  useEffect(() => {
    const { isLoading, loggedIn } = auth
    if(!isLoading){
      if(!loggedIn && !window.location.pathname.startsWith('/auth')) window.location.href = '/auth'
      else if(loggedIn && window.location.pathname.startsWith('/auth')) window.location.href = '/app'
    }
  }, [auth])

  const handleChange = useCallback(a => {
    if(a.goForward || a.goBackward)
      setProperties({
        ...properties,
        action: a.goBackward ? properties.action - 1 : properties.action + 1,
        [a.id]: a.value
      })
    else {
      properties.history.splice(properties.action+1, properties.history.length - (properties.action + 1) , a.value)
      setProperties({
        ...properties,
        action: properties.action + 1,
        [a.id]: a.value
      })
    }
    window.localStorage.setItem('tab-session', a.value)
  }, [properties])

  const handleCredential = useCallback(a => {
    if(a.id && a.target) setAuth({ ...auth, [a.id]: a.target })
    else setAuth(a)
  }, [auth])

  return (
    <Router>
      <Route path='/app' exact>
        <SideBar properties={properties} handleChange={handleChange} />
        <AppLayout properties={properties} handleChange={handleChange} config={properties} />
      </Route>
      <Route path='/auth' component={() => <Auth config={config} handleCredential={handleCredential} />} />
    </Router>
  )
}