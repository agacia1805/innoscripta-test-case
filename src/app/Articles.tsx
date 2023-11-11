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

  return (
    <div>Test</div>
      );
};

