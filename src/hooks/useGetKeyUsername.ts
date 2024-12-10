const useGetKeyUsername = (username: string) => {
  return username.toLowerCase().replace(/\s+/g, '');
};

export default useGetKeyUsername;
