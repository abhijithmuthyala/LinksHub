import { useRouter } from 'next/router'
import { subcategoryArray as searchOptions } from '../../types'
import { SearchbarAction } from './SearchbarReducer'

interface SuggestionsProps {
  searchQuery: string,
  showSuggestions: boolean,
  dispatchSearch: (action: SearchbarAction) => void
}

export const SearchbarSuggestions: React.FC<SuggestionsProps> = ({
  searchQuery,
  dispatchSearch, 
  showSuggestions
}) => {
  const router = useRouter()
  const suggestions = getFilteredSuggestions(searchQuery)

  const handleSuggestionClick = (searchQuery: string) => {
    dispatchSearch({ type: 'suggestion_click', searchQuery })
    router.push({
      pathname: '/search',
      query: {
        query: searchQuery,
      },
    })
  }

  if(!(suggestions.length > 0 && showSuggestions)) return null

  return (
    <ul className="absolute z-10 text-light-primary bg-theme-secondary w-full mt-1 rounded-lg shadow-2xl">
      {suggestions.map((suggestion) => (
        <li
          key={suggestion}
          className="px-4 py-2 cursor-pointer hover:bg-[rgba(0,0,0,0.2)] capitalize"
          onClick={() => handleSuggestionClick(suggestion)}
        >
          {suggestion.replace('-', ' ')}
        </li>
      ))}
    </ul>
  )
}

const getFilteredSuggestions = (query: string) => {
  const normalisedQuery = query.trim().toLowerCase()
  if (normalisedQuery.length === 0) {
    return []
  }

  const suggestions = new Set<string>([])
  searchOptions.forEach((option) => {
    const normalisedOption = option.toLowerCase()
    if (normalisedOption.includes(normalisedQuery)) {
      suggestions.add(normalisedOption)
    }
  })

  return Array.from(suggestions)
}