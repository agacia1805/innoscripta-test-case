'use client';

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

export const Articles = () => {
const newsApiKey = '66e91b5815f04ed792631df8cdfc0822';
const guardianApiKey = '84411a34-7972-4451-b787-dca38e5ea6dc';
const nytApiKey = '5WttEG3a28sAs6NX0i5X23WK3ZXAQ4Rj';

const {data: newsApiData} = useQuery({queryKey: ['newsApiArticles'], queryFn: async () => {
   const response = await fetch(`https://newsapi.org/v2/everything?q=bitcoin&apiKey=${newsApiKey}`);
   const data = await response.json();
   return data;
}});

const {data: guardianApiData} = useQuery({queryKey: ['guardianApiArticles'], queryFn: async () => {
   const response = await fetch(`https://content.guardianapis.com/search?api-key=${guardianApiKey}`);
   const data = await response.json();
   return data;
}});

const {data: nytApiData} = useQuery({queryKey: ['nytApiArticles'], queryFn: async () => {
   const response = await fetch(`https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${nytApiKey}`);
   const data = await response.json();
   return data;
}});

console.log('newsApiData', newsApiData);
console.log('guardianApiData', guardianApiData);
console.log('nytApiData', nytApiData);

  return (
    <div>
        {newsApiData?.articles.map((item) => {
            return <p>{item.title}</p>
        })}
        {guardianApiData?.response.results.map((item) => {
                    return <p>{item.webTitle}</p>
                })}

        {nytApiData?.results.map((item) => {
                    return <p>{item.title}</p>
                })}
    </div>
  );
};
