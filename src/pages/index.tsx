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
  data: DataResponse[];
  after: string;
};

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async ({ pageParam = null }: PageParam): Promise<FetchImagesResponse> => {
      const result = await api.get('api/images', { params: { pageParam } });

      return result.data;
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.after,
    }
  );

  const formattedData = useMemo(() => {
    const result = data?.pages.map(page => {
      if (page?.data) return page.data;
      return null;
    });

    return result?.flat();
  }, [data]);

  if (isLoading) return <Loading />;

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
