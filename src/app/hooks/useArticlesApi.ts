import {useQuery} from '@tanstack/react-query';

async function fetchArticlesFromApi(apiKey: string | undefined, endpoint: string)
{
    const response = await fetch(`${endpoint}${apiKey}`);
    if (!response.ok) {
        throw new Error('Something went wrong');
    }
    return response.json();
}

export function useArticlesApi()
{
    const newsApiData = useQuery({
                                     queryKey: ['newsApiArticles'],
                                     queryFn: () => fetchArticlesFromApi(process.env.NEXT_PUBLIC_NEWS_API_KEY, 'https://newsapi.org/v2/everything?q=general&apiKey=')
                                 });
    const guardianApiData = useQuery({
                                         queryKey: ['guardianApiArticles'],
                                         queryFn: () => fetchArticlesFromApi(process.env.NEXT_PUBLIC_GUARDIAN_API_KEY, 'https://content.guardianapis.com/search?&show-tags=contributor&api-key=')
                                     });
    const nytApiData = useQuery({
                                    queryKey: ['nytApiArticles'],
                                    queryFn: () => fetchArticlesFromApi(process.env.NEXT_PUBLIC_NYT_API_KEY, 'https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=')
                                });

    return {
        newsApiData: newsApiData.data,
        guardianApiData: guardianApiData.data,
        nytApiData: nytApiData.data,
        isLoadingNewsApiData: newsApiData.isLoading,
        isLoadingGuardianApiData: guardianApiData.isLoading,
        isLoadingNytApiData: nytApiData.isLoading,
        isErrorNewsApiData: newsApiData.isError,
        isErrorGuardianApiData: guardianApiData.isError,
        isErrorNytApiData: nytApiData.isError,
    };
}
