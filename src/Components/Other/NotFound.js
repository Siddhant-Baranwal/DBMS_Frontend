import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Not found'
  }, [])

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">Oops! Page not found!</h1>
      <div className="home-links-container">
        <Link className="home-link" to="/">Go to homepage</Link>
      </div>
    </div>
  )
}
