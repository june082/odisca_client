import { useState } from "react";

export const usePagination = (
  args: any
): {
  startPage: number;
  lastPage: number;
  onClickPage: (page: number) => () => void;
  onClickPrevPage: () => void;
  onClickNextPage: () => void;
} => {
  const [startPage, setStartPage] = useState(1);
  const lastPage = args.count ? Math.ceil(args.count / 10) : 0;

  const onClickPage = (page: number) => (): void => {
    void args.refetch({ page });
  };

  const onClickPrevPage = (): void => {
    if (startPage === 1) return;
    setStartPage(startPage - 10);
    void args.refetch({ page: startPage - 10 });
  };

  const onClickNextPage = (): void => {
    if (startPage + 10 <= lastPage) {
      setStartPage(startPage + 10);
      void args.refetch({ page: startPage + 10 });
    }
  };

  return {
    startPage,
    lastPage,
    onClickPage,
    onClickPrevPage,
    onClickNextPage,
  };
};