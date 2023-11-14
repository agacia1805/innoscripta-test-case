'use client';

import * as React from "react";
import {useMemo, Fragment, useEffect, useState} from 'react';
import { useQuery } from "@tanstack/react-query";
import { Dialog, Disclosure, Transition, Switch } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid'
import {ArticleItem} from './ArticleItem';

export const Articles = () => {
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

const fetchArticlesFromApi = async (apiKey, endpoint) => {
        const response = await fetch(`${endpoint}${apiKey}`);
        const data = await response.json();
        return data;
 };

const { data: newsApiData, isLoading: isLoadingNewsApi } = useQuery({queryKey: ['newsApiArticles'],
    queryFn: () => fetchArticlesFromApi(process.env.NEXT_PUBLIC_NEWS_API_KEY, 'https://newsapi.org/v2/everything?q=general&apiKey=')});
const { data: guardianApiData, isLoading: isLoadingGuardian } = useQuery({queryKey: ['guardianApiArticles'],
    queryFn: () => fetchArticlesFromApi(process.env.NEXT_PUBLIC_GUARDIAN_API_KEY, 'https://content.guardianapis.com/search?&show-tags=contributor&api-key=')});
const { data: nytApiData, isLoading: isLoadingNytApi } = useQuery({queryKey: ['nytApiArticles'],
    queryFn: () => fetchArticlesFromApi(process.env.NEXT_PUBLIC_NYT_API_KEY, 'https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=')});

const normalizeArticles = (newsApiData, guardianApiData, nytApiData) => {
  const normalizedNewsApiData = newsApiData?.map(article => ({
    author: article.author,
    content: article.description,
    date: article.publishedAt,
    source: article.source.name,
    title: article.title,
    url: article.url
  })) || [];

  const normalizedGuardianData = guardianApiData?.map(article => ({
    author: article.tags?.map(tag => tag.webTitle).join(', '),
    category: article.pillarName,
    date: article.webPublicationDate,
    title: article.webTitle,
    source: 'The Guardian',
    url: article.webUrl,
  })) || [];

  const normalizedNytData = nytApiData?.map(article => ({
    author: article.byline.substring(3),
    category: article.section,
    content: article.abstract,
    date: article.published_date,
    keywords: article.adx_keywords,
    title: article.title,
    source: article.source,
    url: article.url
  })) || [];

  return [...normalizedNewsApiData, ...normalizedGuardianData, ...normalizedNytData];
};

const allDataFetched = !isLoadingNewsApi && !isLoadingGuardian && !isLoadingNytApi && newsApiData && guardianApiData && nytApiData;

const normalizedArticles = useMemo(() => {
    if (allDataFetched) {
      return normalizeArticles(newsApiData.articles, guardianApiData.response.results, nytApiData.results);
    }
    return [];
  }, [allDataFetched, newsApiData, guardianApiData, nytApiData]);

const filters = useMemo(() => {
    const authorsSet = new Set();
    const categoriesSet = new Set();
    const sourcesSet = new Set();

    normalizedArticles.forEach(article => {
      if (article.author) authorsSet.add(article.author);
      if (article.category) categoriesSet.add(article.category);
      if (article.source) sourcesSet.add(article.source);
    });

    return [
      {
        id: 'author',
        name: 'Author',
        options: Array.from(authorsSet).map(author => ({ value: author, label: author })),
      },
      {
        id: 'category',
        name: 'Category',
        options: Array.from(categoriesSet).map(category => ({ value: category, label: category })),
      },
      {
        id: 'source',
        name: 'Source',
        options: Array.from(sourcesSet).map(source => ({ value: source, label: source })),
      },
      {
        id: 'date',
        name: 'Date',
      },
    ];
  }, [normalizedArticles]);


   const [selectedFilters, setSelectedFilters] = useState({
    author: [],
    category: [],
    source: [],
    date: []
   });

  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [savePreferences, setSavePreferences] = useState(false);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prevFilters => {
      // Check if the filter for this type already includes this value
      const isValueSelected = prevFilters[filterType].includes(value);
      const newFilterValues = isValueSelected
        ? prevFilters[filterType].filter(v => v !== value) // If it's selected, remove it
        : [...prevFilters[filterType], value]; // If it's not selected, add it

      return {
        ...prevFilters,
        [filterType]: newFilterValues
      };
    });
  };

const filteredArticles = useMemo(() => {
  return normalizedArticles.filter(article => {
    // Filter by author
    if (selectedFilters.author.length > 0 && !selectedFilters.author.includes(article.author)) {
      return false;
    }
    // Filter by category
    if (selectedFilters.category.length > 0 && !selectedFilters.category.includes(article.category)) {
      return false;
    }
    // Filter by source
    if (selectedFilters.source.length > 0 && !selectedFilters.source.includes(article.source)) {
      return false;
    }
    // Filter by keyword
    if (searchKeyword) {
      const keywordLower = searchKeyword.toLowerCase();
      const titleMatch = article.title.toLowerCase().includes(keywordLower);
      const keywordFieldMatch = article.keywords && article.keywords.toLowerCase().includes(keywordLower);
      if (!titleMatch && !keywordFieldMatch) {
        return false;
      }
    }
    // Filter by date range
    const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;
    const articleDate = new Date(article.date);
    // If articleDate is invalid, filter out the article
    if (isNaN(articleDate)) return false;
    // If startDate is set and articleDate is before startDate, filter out the article
    if (startDate && articleDate < startDate) {
      return false;
    }
    // If endDate is set and articleDate is after endDate, filter out the article
    if (endDate && articleDate > endDate) {
      return false;
    }
    // If the article passes all filters, include it
    return true;
  });
}, [normalizedArticles, selectedFilters, searchKeyword, dateRange]);

// Load preferences on mount
useEffect(() => {
  const savedFilters = JSON.parse(localStorage.getItem('userPreferences'));
  if (savedFilters) {
    setSelectedFilters(savedFilters);
    setSavePreferences(true);
  }
}, []);

// Save or clear preferences when the toggle changes
useEffect(() => {
  if (savePreferences) {
    localStorage.setItem('userPreferences', JSON.stringify(selectedFilters));
  } else {
    localStorage.removeItem('userPreferences');
  }
}, [savePreferences, selectedFilters]);

const handleToggleChange = (newValue) => {
  setSavePreferences(newValue);
  if (!newValue) {
    // Clear local storage
    localStorage.removeItem('userPreferences');
    // Reset filters
    setSelectedFilters({
      author: [],
      category: [],
      source: [],
      date: []
    });
  } else {
    // Save current filters to local storage
    localStorage.setItem('userPreferences', JSON.stringify(selectedFilters));
  }
};

  return (
    <div className="bg-gray-100  flex-grow">
          <div>
            <Transition.Root show={mobileFiltersOpen} as={Fragment}>
              <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 z-40 flex">
                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                      <div className="flex items-center justify-between px-4">
                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                        <button
                          type="button"
                          className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                          onClick={() => setMobileFiltersOpen(false)}
                        >
                          <span className="sr-only">Close menu</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>

                      {/* Filters */}
                      <form className="mt-4">
                        {filters.map((section) => (
                          <Disclosure as="div" key={section.name} className="border-t border-gray-200 pb-4 pt-4">
                            {({ open }) => (
                              <fieldset>
                                <legend className="w-full px-2">
                                  <Disclosure.Button className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                                    <span className="text-sm font-medium text-gray-900 ">{section.name}</span>
                                    <span className="ml-6 flex h-7 items-center">
                                      <ChevronDownIcon
                                        className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')}
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </Disclosure.Button>
                                </legend>
                                <Disclosure.Panel className="px-4 pb-2 pt-4">
                                 {section.id === 'date' ?
                                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                                     <div className="flex flex-col">
                                    <label htmlFor="start-date" className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
                                    <input
                                        type="date"
                                        id="start-date"
                                        name="start-date"
                                        value={dateRange.startDate}
                                        onChange={e => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                        className="cursor-pointer bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="end-date" className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
                                    <input
                                        type="date"
                                        id="end-date"
                                        name="end-date"
                                        value={dateRange.endDate}
                                        onChange={e => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                        className="cursor-pointer bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </div>
                               </div>
                                 :
                                  <div className="space-y-3 pt-4 max-h-60 overflow-y-auto">
                                    {section.options.map((option, optionIdx) => (
                                      <div key={option.value} className="flex items-center">
                                        <input
                                          id={`${section.id}-${optionIdx}-mobile`}
                                          name={`${section.id}[]`}
                                          defaultValue={option.value}
                                          key={option.id}
                                          checked={selectedFilters[section.id].includes(option.value)}
                                          onChange={(e) => handleFilterChange(section.id, option.value)}
                                          type="checkbox"
                                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label
                                          htmlFor={`${section.id}-${optionIdx}-mobile`}
                                          className="ml-3 text-sm text-gray-500"
                                        >
                                          {option.label}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                  }
                                </Disclosure.Panel>
                              </fieldset>
                            )}
                          </Disclosure>
                        ))}
                      </form>
                    <div className="flex justify-between p-4 w-56 sm:flex lg:hidden md:hidden">
                                                         <label htmlFor="save-preferences-toggle" className="text-sm font-medium text-gray-700">
                                                           {savePreferences ? "Remove preferences" : "Save preferences"}
                                                         </label>
                                                         <Switch
                                                           id="save-preferences-toggle"
                                                           checked={savePreferences}
                                                           onChange={handleToggleChange}
                                                           className={`${
                                                             savePreferences ? 'bg-indigo-600' : 'bg-gray-200'
                                                           } relative inline-flex items-center h-6 rounded-full w-11`}
                                                         >
                                                           <span
                                                             className={`${
                                                               savePreferences ? 'translate-x-6' : 'translate-x-1'
                                                             } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                                           />
                                                           <span className="sr-only">Save preferences/Remove preferences</span>
                                                         </Switch>
                                                       </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>

            <main className="mx-auto max-w-2xl px-4 py-2 sm:px-6 sm:py-2 lg:max-w-7xl lg:px-8">
              <div className="lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
                <aside className="flex flex-col gap-3">
                  <h2 className="sr-only">Filters</h2>
                    <div>
                        <label htmlFor="search" className="block text-m font-semibold leading-6 text-gray-900">
                           Quick search
                        </label>
                        <div className="relative mt-2 flex items-center">
                            <input
                              type="text"
                              name="search"
                              id="search"
                              onChange={e => setSearchKeyword(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 px-4 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"                            />
                        </div>
                    </div>
                  <button
                    type="button"
                    className="inline-flex items-center lg:hidden"
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    <span className="text-sm font-medium text-gray-700">Filters</span>
                    <PlusIcon className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  </button>

                  <div className="hidden lg:block">
                    <form className="space-y-10 divide-y divide-gray-200">
                      {filters.map((section, sectionIdx) => (
                        <div key={section.name} className={sectionIdx === 0 ? null : 'pt-6'}>
                          <fieldset>
                            {section.id === 'date' ?
                                <div className="flex flex-col gap-4 mb-4">
                                     <div className="flex flex-col">
                                      <label htmlFor="start-date" className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
                                      <input
                                       type="date"
                                       id="start-date"
                                       name="start-date"
                                       onChange={e => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                       className="cursor-pointer bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                       />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="end-date" className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
                                    <input
                                       type="date"
                                       id="end-date"
                                       name="end-date"
                                       onChange={e => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                       className="cursor-pointer bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </div>
                               </div>
                            :
                            <div className="space-y-3 max-h-60 overflow-y-auto relative p-0">
                            <div className='sticky top-0 pointer-events-none -mb-1'>
                             <legend className="block text-m font-semibold text-gray-900 bg-gray-100">{section.name}</legend>
                              <div className='h-4 bg-gradient-to-b from-gray-100'/>
                             </div>
                              {section.options.map((option, optionIdx) => (
                                <div key={option.value} className="flex items-center">
                                  <input
                                   id={`${section.id}-${optionIdx}`}
                                   name={`${section.id}[]`}
                                   defaultValue={option.value}
                                   key={option.id}
                                   checked={selectedFilters[section.id].includes(option.value)}
                                   onChange={(e) => handleFilterChange(section.id, option.value)}
                                   type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label htmlFor={`${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-700">
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                            }
                          </fieldset>
                        </div>
                      ))}
                    </form>
                  </div>
                </aside>
                <div className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3 lg:pt-20">
                <div className="flex justify-between pb-4 w-52 hidden ml-auto lg:flex">
                                        <label htmlFor="save-preferences-toggle" className="text-sm font-medium text-gray-700">
                                          {savePreferences ? "Remove preferences" : "Save preferences"}
                                        </label>
                                        <Switch
                                          id="save-preferences-toggle"
                                          checked={savePreferences}
                                          onChange={handleToggleChange}
                                          className={`${
                                            savePreferences ? 'bg-indigo-600' : 'bg-gray-200'
                                          } relative inline-flex items-center h-6 rounded-full w-11`}
                                        >
                                          <span
                                            className={`${
                                              savePreferences ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                          />
                                          <span className="sr-only">Save preferences/Remove preferences</span>
                                        </Switch>
                                      </div>
                <ul role="list" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
                    {filteredArticles.map((article) => {
                        return <ArticleItem url={article.url} title={article.title} author={article.author} content={article.content} key={article.url}/>
                    })}
                </ul>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
};

