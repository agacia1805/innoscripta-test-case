'use client';

import * as React from "react";
import {useMemo} from 'react';
import { useQuery } from "@tanstack/react-query";
import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useHistory, useLocation } from 'react-router-dom';


export const Articles = () => {
const newsApiKey = '66e91b5815f04ed792631df8cdfc0822';
const guardianApiKey = '84411a34-7972-4451-b787-dca38e5ea6dc';
const nytApiKey = '5WttEG3a28sAs6NX0i5X23WK3ZXAQ4Rj';
const param = '';

const filters = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'purple', label: 'Purple' },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'pants-shorts', label: 'Pants & Shorts' },
    ],
  },
  {
    id: 'sizes',
    name: 'Sizes',
    options: [
      { value: '2xl', label: '2XL' },
    ],
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

// const filterByAuthorGeneral = (data, author) => {
//   return [].concat(...data)?.filter(article => {
//       const articleAuthor = article?.author || article?.byline || (article?.tags?.map(tag => tag.webTitle).join(', '));
//       return articleAuthor?.includes(author);
//     });
// };
// // console.log(filterByAuthorGeneral([nytApiData, newsApiData, guardianApiData], 'do'));
//
// const filterByKeywordGeneral = (data, keyword) => {
//   return [].concat(...data)?.filter(article => {
//       const articleKeyword = article?.adx_keywords || article?.webTitle || article?.title;
//       return articleKeyword?.includes(keyword);
//     });
// };
// // console.log(filterByKeywordGeneral([nytApiData, newsApiData, guardianApiData], 'Israel'));
//
// const filterBySourceGeneral = (data, source) => {
//   return [].concat(...data)?.filter(article => {
//       const articleSource =  article?.source?.name || article?.source || (article?.webUrl?.includes('theguardian') ? 'The Guardian' : null);
//       return articleSource?.includes(source);
//     });
// };
//
// // console.log(filterBySourceGeneral([nytApiData, newsApiData, guardianApiData], 'Gizmo'));
//
// const filterByCategoryGeneral = (data, category) => {
//   return [].concat(...data)?.filter(article => {
//       const articleCategory = article?.section || article?.pillarName;
//       return articleCategory?.includes(category);
//     });
// };
//
// // console.log(filterByCategoryGeneral([nytApiData, newsApiData, guardianApiData], 'Sport'));
//
// const filterByDateGeneral = (data, category) => {
//   return [].concat(...data)?.filter(article => {
//       const articleCategory = article?.section || article?.pillarName;
//       return articleCategory?.includes(category);
//     });
// };

// const filterDates = (dataArray, thresholdDate) => {
//   const thresholdDateObj = new Date(thresholdDate);
//   const filteredArrays = dataArray.map(data => {
//     return data.filter(article => {
//       const dateField = Object.keys(article).find(fieldName => {
//         const dateString = article[fieldName];
//         return dateString && new Date(dateString).toString() !== 'Invalid Date';
//       });
//
//       if (!dateField) {
//         return false;
//       }
//
//       const articleDate = new Date(article[dateField]);
//
//       return !isNaN(articleDate) && articleDate > thresholdDateObj;
//     });
//   });
//
//   return [].concat(...filteredArrays);
// };
//
// console.log(filterDates([nytApiData, newsApiData, guardianApiData], '2023-10'));

const fetchArticlesFromApi = async (apiKey, endpoint) => {
        const response = await fetch(`${endpoint}${apiKey}`);
        const data = await response.json();
        return data;
 };

const { data: newsApiData, isLoading: isLoadingNewsApi } = useQuery({queryKey: ['newsApiArticles'],
    queryFn: () => fetchArticlesFromApi(newsApiKey, 'https://newsapi.org/v2/everything?q=bitcoin&apiKey=')});
const { data: guardianApiData, isLoading: isLoadingGuardian } = useQuery({queryKey: ['guardianApiArticles'],
    queryFn: () => fetchArticlesFromApi(guardianApiKey, 'https://content.guardianapis.com/search?&show-tags=contributor&api-key=')});
const { data: nytApiData, isLoading: isLoadingNytApi } = useQuery({queryKey: ['nytApiArticles'],
    queryFn: () => fetchArticlesFromApi(nytApiKey, 'https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=')});

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

  console.log(normalizedArticles)


  return (
    <div className="bg-white">
          <div>
            {/* Mobile filter dialog */}
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
                                    <span className="text-sm font-medium text-gray-900">{section.name}</span>
                                    <span className="ml-6 flex h-7 items-center">
                                      <ChevronDownIcon
                                        className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')}
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </Disclosure.Button>
                                </legend>
                                <Disclosure.Panel className="px-4 pb-2 pt-4">
                                  <div className="space-y-6">
                                    {section.options.map((option, optionIdx) => (
                                      <div key={option.value} className="flex items-center">
                                        <input
                                          id={`${section.id}-${optionIdx}-mobile`}
                                          name={`${section.id}[]`}
                                          defaultValue={option.value}
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
                                </Disclosure.Panel>
                              </fieldset>
                            )}
                          </Disclosure>
                        ))}
                      </form>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>

            <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
              <div className="border-b border-gray-200 pb-10">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">New Arrivals</h1>
                <p className="mt-4 text-base text-gray-500">
                  Checkout out the latest release of Basic Tees, new and improved with four openings!
                </p>
              </div>

              <div className="pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
                <aside>
                  <h2 className="sr-only">Filters</h2>

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
                        <div key={section.name} className={sectionIdx === 0 ? null : 'pt-10'}>
                          <fieldset>
                            <legend className="block text-sm font-medium text-gray-900">{section.name}</legend>
                            <div className="space-y-3 pt-6">
                              {section.options.map((option, optionIdx) => (
                                <div key={option.value} className="flex items-center">
                                  <input
                                    id={`${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label htmlFor={`${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </fieldset>
                        </div>
                      ))}
                    </form>
                  </div>
                </aside>
                <div className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
                {normalizedArticles.map((article) => {
                return <>
                        <a href={article.url} className="text-gray-600">{article.title}</a>
                        <p className="text-gray-600">{article.content}</p>
                        <p className="text-gray-600">{article.author}</p>
                       </>
                })}</div>
              </div>
            </main>
          </div>
        </div>

      );
};

