import { useRef, useEffect } from 'react'

import SearchIcon from 'assets/icons/SearchIcon'
import { SearchbarSuggestions } from './SearchbarSuggestions'
import { ErrorMessage } from 'components/ErrorMessage'

import { SearchbarAction } from './SearchbarReducer'
import { useRouter } from 'next/router'

interface SearchbarProps {
  dispatchSearch: (action: SearchbarAction) => void
  searchQuery: string
  showSuggestions: boolean
  searchQueryIsValid: boolean
}

const SEARCH_ERROR_MSG = 'Please enter a valid search query'

export const Searchbar: React.FC<SearchbarProps> = ({
  dispatchSearch,
  searchQuery,
  showSuggestions,
  searchQueryIsValid,
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatchSearch({
      type: 'search_query_change',
      searchQuery: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    dispatchSearch({ type: 'submit' })
    if (searchQuery.trim() !== '') {
      router.push({
        pathname: '/search',
        query: {
          query: searchQuery,
        },
      })
    }
  }

  useEffect(() => {
    const handleClickOutsideDropdown = (e: MouseEvent) => {
      if ((formRef.current as HTMLFormElement).contains(e.target as Node))
        return
      dispatchSearch({ type: 'close_suggestions' })
    }

    document.addEventListener('mousedown', handleClickOutsideDropdown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDropdown)
    }
  }, [dispatchSearch])

  return (
    <form noValidate ref={formRef} onSubmit={handleSubmit} role="search">
      <div className="relative">
        <div className="flex items-center">
          <label htmlFor="simple-search" className="sr-only">
            Quick search
          </label>
          <input
            type="text"
            id="simple-search"
            name="simple-search"
            className="block p-2.5 w-full bg-transparent text-sm text-dark dark:text-text-primary border border-dashed border-gray-text focus:border-theme-secondary dark:focus:border-theme-primary dark:focus:ring-theme-primary focus:ring-theme-secondary dark:placeholder-gray-text outline-none transition-all ease-in-out duration-300 rounded-lg capitalize"
            placeholder="Quick search..."
            value={searchQuery}
            onChange={handleSearchChange}
            autoComplete="off"
            required
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2.5 bg-theme-secondary text-light-primary rounded-md border border-dashed border-transparent hover:border-theme-primary hover:bg-transparent hover:text-theme-primary dark:hover:text-theme-primary transition-colors duration-300 ease-in-out"
            aria-label="submit query button"
          >
            <SearchIcon className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <SearchbarSuggestions
          searchQuery={searchQuery}
          dispatchSearch={dispatchSearch}
          showSuggestions={showSuggestions}
        />
      </div>
      {!searchQueryIsValid && <ErrorMessage>{SEARCH_ERROR_MSG}</ErrorMessage>}
    </form>
  )
}


