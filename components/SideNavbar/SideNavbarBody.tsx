import { FC, memo } from 'react'
import { Searchbar } from 'components/Searchbar/Searchbar'
import classNames from 'classnames'
import { useTheme } from 'next-themes'

import { SideNavbarCategoryList } from './SideNavbarCategoryList'
import { SearchbarSuggestions } from '../Searchbar/SearchbarSuggestions'

import { useSearchReducer } from 'hooks/useSearchReducer'
import { useDebounce } from 'hooks/useDebounce'

const MemoizedSideNavbarCategoryList = memo(SideNavbarCategoryList)
const MemoizedSearchbarSuggestions = memo(SearchbarSuggestions)
const SUGGESTIONS_DEBOUNCE_THRESHOLD = 300

export const SideNavbarBody: FC = () => {
  const { theme } = useTheme()
  const [searchState, dispatchSearch] = useSearchReducer()
  const [debouncedSearchQuery, queueSetDebouncedSearchQuery] = useDebounce(
    searchState.searchQuery,
    SUGGESTIONS_DEBOUNCE_THRESHOLD
  )

  return (
    <div
      className={classNames(
        `bg-[rgba(243,244,246,1)] h-full w-full overflow-x-hidden whitespace-nowrap transition-all ease-in dark:bg-dark dark:text-text-primary`,
        theme === 'light' ? 'scrollColorLight' : 'scrollColorDark'
      )}
    >
      <div className="bg-primary-light transiton-all w-full p-4 transition-none ease-in dark:bg-dark">
        <Searchbar
          {...searchState}
          dispatchSearch={dispatchSearch}
          queueSetDebouncedSearchQuery={queueSetDebouncedSearchQuery}
        >
          <MemoizedSearchbarSuggestions
            searchQuery={debouncedSearchQuery}
            dispatchSearch={dispatchSearch}
            showSuggestions={searchState.showSuggestions}
          />
        </Searchbar>
      </div>
      <MemoizedSideNavbarCategoryList query={searchState.categoryQuery} />
    </div>
  )
}
