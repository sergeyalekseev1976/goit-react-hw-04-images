import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { getImages, PER_PAGE } from 'api/api';
import { Container } from './App.styled';
import toast, { Toaster } from 'react-hot-toast';
import { LoadMoreBtn } from './Button/Button';
import { Loader } from './Loader/Loader';

export const App = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagesFound, setImagesFound] = useState(0);

  useEffect(() => {
    if (query === '') {
      return;
    }

    const searchImages = async () => {
      try {
        setIsLoading(true);
        const images = await getImages(query, page);
        if (!images.totalHits) {
          setIsLoading(false);
          return toast.error('Enter correct query');
        }
        setItems(prevState => [...items, ...images.hits]);
        setIsLoading(false);
        setImagesFound(images.hits.length);
      } catch (error) {
        toast.error('Oops, something went wrong');
      } finally {
        setIsLoading(false);
      }
    };
    searchImages();
  }, [page, query, items]);

  const handleSearch = searchQuery => {
    if (searchQuery !== query) {
      setPage(1);
      setQuery(searchQuery);
      setItems([]);
      setImagesFound(0);
    }
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  return (
    <Container>
      <Toaster position="top-right" reverseOrder={false} />
      <Searchbar onSubmit={handleSearch} isSubmiting={isLoading} />
      {items.length > 0 && <ImageGallery items={items} />}

      {imagesFound === PER_PAGE && !isLoading && (
        <LoadMoreBtn onClick={loadMore} />
      )}
      {isLoading && <Loader />}
    </Container>
  );
};
