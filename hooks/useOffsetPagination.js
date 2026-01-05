import { useState, useCallback } from "react";

export default function useOffsetPagination({
  limit = 10,
  initialOffset = 0,
  onFetch,
}) {
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(
    async ({ isRefresh = false } = {}) => {
      if (loading) return;
      if (!hasMore && !isRefresh) return;

      setLoading(true);

      const currentOffset = isRefresh ? initialOffset : offset;

      try {
        const result = await onFetch({
          offset: currentOffset,
          limit,
          isRefresh,
        });

        if (result?.count < limit) {
          setHasMore(false);
        }

        setOffset(currentOffset + limit);
        return result;
      } catch (err) {
        console.log("Pagination Error:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [offset, limit, hasMore, loading]
  );

  const onRefresh = async (showloader =true) => {
    setRefreshing(showloader);
    setHasMore(true);
    setOffset(initialOffset);
    return fetchData({ isRefresh: true });
  };

  const onEndReached = async () => {
    return fetchData();
  };

  return {
    loading,
    refreshing,
    hasMore,
    onRefresh,
    onEndReached,
    fetchData,
  };
}
