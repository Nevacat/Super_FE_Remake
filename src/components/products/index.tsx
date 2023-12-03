import React from 'react';
import * as S from './styles';
import Author from './Author';
import Search from '../common/Search';
import Product from './Product';
import CommonTitle from '../common/Title';
import { QueryClient, dehydrate, useQuery } from 'react-query';
import { getMainAuthors } from '@/api/authors';
import { getProducts } from '@/api/products';
import { AuthorsProps } from '@/interface/authors';
import { MainProduct } from '@/interface/product';
const titleData = {
  title: '성수 포지션',
  subTitle: '슈퍼포지션 두 번째 기획 전시',
};

export async function getStaticProps(){
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery('products', getProducts);
  await queryClient.prefetchQuery('authors', getMainAuthors);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

function ProductsPage() {
  const { data: productsData } = useQuery('products', getProducts,{
    initialData: () => {
      const queryClient = new QueryClient();
      return queryClient.getQueryData('products');
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  });
  const { data: authorsData } = useQuery('authors', getMainAuthors,{
    initialData: () => {
      const queryClient = new QueryClient();
      return queryClient.getQueryData('authors');
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  });
  const [searchData, setSearchData] = React.useState<MainProduct[]>([]);
  return (
    <S.ProductsContainer>
      <CommonTitle data={titleData} />
      <S.Authors>
        {authorsData?.map((author: AuthorsProps,index:number) => (
          <Author key={index} data={author} />
        ))}
      </S.Authors>
      <Search setData={setSearchData} />
      <S.Products column={2} gap={20} align={'justify'} defaultDirection={'end'}>
        {searchData.length===0?productsData?.map((product: MainProduct, index: number) => (
          <Product key={index} data={product} />
        )):searchData.map((product: MainProduct, index: number) => (
          <Product key={index} data={product} />
        ))}
      </S.Products>
    </S.ProductsContainer>
  );
}

export default ProductsPage;
