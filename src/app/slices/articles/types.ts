export type NewsApiArticle = {
    author: string;
    description: string;
    publishedAt: string;
    source: { name: string };
    title: string;
    url: string;
};

export type GuardianApiArticle = {
    tags: { webTitle: string }[];
    pillarName: string;
    webPublicationDate: string;
    webTitle: string;
    webUrl: string;
};

export type NytApiArticle = {
    byline: string;
    section: string;
    abstract: string;
    published_date: string;
    adx_keywords: string;
    title: string;
    source: string;
    url: string;
};

export type DateRange = {
    startDate: string;
    endDate: string;
};

export interface Filters
{
    author: string[];
    category: (string | undefined)[];
    source: string[];
    date: string[];
}

export interface NormalizedArticle
{
    author: string;
    content?: string;
    date: string;
    source: string;
    title: string;
    url: string;
    keywords?: string;
    category?: string;
}