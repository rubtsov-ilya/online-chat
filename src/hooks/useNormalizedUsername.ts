const useNormalizedUsername = (username: string): string => {
  return username.toLowerCase().replace(/\s+/g, '');
};

export default useNormalizedUsername;
