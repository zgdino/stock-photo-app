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
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')

  const fetchImages = async () => {
    setLoading(true)
    let url
    const urlPage = `&page=${page}`
    const urlQuery = `&query=${query}`

    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
    } else {
      url = `${mainUrl}${clientID}${urlPage}`
    }

    try {
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)
      setPhotos((oldPhotos) => {
        // if we have a new query and are on the page 1 return results only
        if (query && page === 1) {
          return data.results
          // query is still true but not on the page 1
        } else if (query) {
          // what we need is in the object under .results
          return [...oldPhotos, ...data.results]
        }
        // to already fetched images, add new ones from data
        else {
          return [...oldPhotos, ...data]
        }
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
    // prevent default behaviour
    e.preventDefault()
    // for every new query set page to 1; initial value of the page is 0
    setPage(1)
  }

  return (
    <main>
      <section className='search'>
        <form className='search-form'>
          <input
            type='text'
            placeholder='search'
            className='form-input'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
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
