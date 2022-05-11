import React, { useState, useEffect } from 'react'
import { FaBroadcastTower, FaImages, FaSearch } from 'react-icons/fa'
import Photo from './Photo'

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`

// documentation - API limits the number of queries
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState([])
  const [page, setPage] = useState(1)
  const fetchImages = async () => {
    setLoading(true)
    let url
    const urlPage = `&page=${page}`
    url = `${mainUrl}${clientID}${urlPage}`
    try {
      const response = await fetch(url)
      const data = await response.json()
      setPhotos((oldPhotos) => {
        // to already fetched images, add new ones from data
        return [...oldPhotos, ...data]
      })
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [page])

  useEffect(() => {
    // setting up scroll event listener
    const event = window.addEventListener('scroll', () => {
      if (
        // don't do it if already loading
        !loading &&
        // 2px before reaching the bottom of the page
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      ) {
        setPage((oldPage) => {
          // load next set of images
          return oldPage + 1
        })
      }
    })
    // making sure to remove the event listener by the end
    return () => window.removeEventListener('scroll', event)
  }, [])

  // setting functionality for submit button
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('hello')
  }

  return (
    <main>
      <section className='search'>
        <form className='search-form'>
          <input type='text' placeholder='search' className='form-input' />
          <button className='submit-btn' type='submit' onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className='photos'>
        <div className='photos-center'>
          {photos.map((image, index) => {
            // for each of the photos return a Photo component
            return <Photo key={image.id} {...image} />
          })}
        </div>
        {/* loading on the bottom of the page because of the infinite scroll */}
        {loading && <h2 className='loading'>Loading...</h2>}
      </section>
    </main>
  )
}

export default App
