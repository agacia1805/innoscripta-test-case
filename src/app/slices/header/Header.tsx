import * as React from "react";
import Link from 'next/link';

export const Header = () => {

        return (
          <header className="bg-gray-100 shadow">
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
              <div className="relative flex h-16 justify-between">
                <div className="relative z-10 flex px-2 lg:px-0">
                  <div className="flex flex-shrink-0 items-center text-xl font-bold text-indigo-600">
                    <Link href="/">NewsByte</Link>
                  </div>
                </div>
              </div>
            </div>
          </header>
  );
};
