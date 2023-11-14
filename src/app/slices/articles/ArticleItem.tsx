import * as React from "react";

type ArticleItem = {
   author: string;
   content: string;
   title: string;
   url: string;
};

export const ArticleItem = ({url, title, content, author}: ArticleItem) => {

  return (
   <li key={url} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow">
     <div className="flex-1 p-8">
     {author && (
       <p className="relative inline-flex w-full items-center rounded-bl-lg border border-transparent italic text-xs font-light text-gray-600">
         {author}
       </p>
       )}
       <div className="flex items-center space-x-3 py-2">
         <h3 className="text-m font-semibold text-gray-900 underline">
           <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
         </h3>
       </div>
       <p className="mt-1 text-sm text-gray-600">{content}</p>
     </div>
   </li>
   );
};

