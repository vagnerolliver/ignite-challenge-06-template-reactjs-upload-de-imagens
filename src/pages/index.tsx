import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type PageParam = {
  pageParam?: number;
};

type DataResponse = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

type FetchImagesResponse = {
  page: DataResponse[];
  pageParams: PageParam[];
};

export default function Home(): JSX.Element {
  const fetchImages = async ({
    pageParam = null,
  }: PageParam): Promise<FetchImagesResponse> => {
    const { data } = await api.get('api/images', { params: { pageParam } });

    console.log('data', data);

    return data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: (lastPage, pages) => lastPage.pageParams,
  });

  const formattedData = useMemo(() => {
    if (data?.pages) {
      return data.pages.data;
    }
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) return <Loading />;

  // TODO RENDER ERROR SCREEN
  if (isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
